import onPush from "../input/onPush";

export default ({
  id,
  reactionManager,
  onEntry = () => { },
  onExit = () => { }
}) => {
  let isComplete = false;
  let interactionCooldown = false;

  /* TODO: Use consts on keys also */
  const onInteractionPushed = onPush("e", ({ origin, collisions = [] }) => {
    if (collisions.length && origin.controlledByUser) {
      if (!interactionCooldown) {
        const firstAvailable = collisions[0];
        const reactionData = reactionManager.get(firstAvailable.type);
        /* Not all things will have a reaction set, plus they might expect
        different properties to be passed in future. */
        if (reactionData) {
          reactionData.reactionEvent([firstAvailable, origin]);
        }
      } else {
        interactionCooldown = false;
      }
    }
  });

  return {
    id,
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: props => onInteractionPushed(props),
    exit: () => onExit()
  };
};
