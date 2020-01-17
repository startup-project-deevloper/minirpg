import { sortByDist } from "../common/helpers";

export default ({
  id,
  actors,
  markers,
  onEntry = () => {},
  onExit = () => {}
}) => {
  let isComplete = false;
  let unoccupied = [].concat(markers);

  /* Find closest un-occupied battle point for each actor and get it to move to it */
  actors.forEach(actor => {
    const nearestMarker = sortByDist(actor, unoccupied)[0];
    unoccupied = unoccupied.filter(x => x.instId !== nearestMarker.instId);
    actor.moveTo(nearestMarker, () => {
      /* Naively get the actors to look at each other, doesn't care who right now */
      actor.lookAt(actors.find(x => x.instId !== actor.instId));
    });
  });

  if (actors.length !== markers.length)
    throw "Marker and Actor length mismatch.";

  /* At battle end, just get everyone to return to following the player, should be on field state */
  // ...
  setTimeout(() => (isComplete = true), 3000);

  return {
    id,
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: () => {
      console.log("Battle state active.");
    },
    exit: () => {
      console.log("Battle state complete.");
      onExit();
    }
  };
};
