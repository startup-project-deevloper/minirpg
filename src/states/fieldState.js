import inventory from "../ui/inventory";
import { ENTITY_TYPE } from "../common/consts";
import onPush from "../input/onPush";

export default ({
  id,
  reactionManager,
  getAllEntitiesOfType = () => {},
  onEntry = () => {},
  onExit = () => {}
}) => {
  let isComplete = false;
  let interactionCooldown = false;

  /* TODO: Use consts on keys also */
  const onInteractionPushed = onPush("e", ({ origin, collisions = [] }) => {
    if (collisions.length && origin.controlledByUser) {
      if (!interactionCooldown) {
        /* Collision usually pre-sorted by this point, it's not up to the state
        to handle this though. */
        const interactible = collisions[0];
        const reactionData = reactionManager.get(interactible.type);
        /* Not all things will have a reaction set, plus they might expect
        different properties to be passed in future. */
        if (reactionData) {
          reactionData.reactionEvent(interactible, [interactible, origin]);
        }
      } else {
        interactionCooldown = false;
      }
    }
  });

  const onAttackPushed = onPush("space", ({ origin, collisions = [] }) => {
    collisions.map(col => {
      if (typeof col.onAttacked === "function") {
        col.onAttacked({
          origin
        });
      }
    });
  });

  /* Technically, the inventory should only be openable in the field (or battle, but that's
  out of this scope). Note: You might want the inventory to be a whole new state, but doing
  it this way means you can overlay it across the game whilst you play. Whatever you need
  basically. You might even want to life this to the index like the other reactions, in fact
  that might make more sense. */
  const onInventoryOpened = onPush("i", () => {
    if (inventory.isBusy()) return;

    /* Get you a list of all items that are being held in data */
    inventory.mount({
      items: getAllEntitiesOfType(ENTITY_TYPE.PICKUP),
      onInventoryClosed: () => inventory.unmount(),
      onItemSelected: itemData => {
        console.log(itemData);
      }
    });

    // Don't forget to unmount it when it's done also!
  });

  return {
    id,
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: props => {
      // TODO: Careful these don't conflict and do weird things (inventory in convo, etc, do not want!)
      onInteractionPushed(props);
      onAttackPushed(props);
      onInventoryOpened();
    },
    exit: () => onExit()
  };
};
