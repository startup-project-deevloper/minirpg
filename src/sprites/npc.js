import StateMachine from "../managers/stateManager";
import aiMoveToState from "../states/aiMoveToState";
import aiWaitState from "../states/aiWaitState";
import { flipSprite } from "./spriteFunctions";
import { uniqueId, getRandomIntInclusive } from "../common/helpers";
import { Sprite, imageAssets, SpriteSheet, Vector } from "kontra";
import { AI_ACTIONS } from "../common/consts";

export default ({
  id,
  x,
  y,
  z = 1,
  customProperties = {},
  entityData = null,
  collisionMethod = (layer, sprite) => {}
}) => {
  if (!id) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

  const entityStateMachine = StateMachine();

  const {
    name,
    type,
    animations,
    frameWidth,
    frameHeight,
    sheet,
    collisionBodyOptions = null,
    manualAnimation = false,
    controlledByUser = false,
    controlledByAI = false,
    collidesWithTiles = true
  } = entityData;

  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });

  /* These are passable to states so they can act accordingly */
  let movementDisabled = false;
  let currentAction = AI_ACTIONS.IDLE;

  // ... Perhaps add these to the sprite instead?
  const doRandomWait = sprite => {
    currentAction = AI_ACTIONS.WAITING;

    entityStateMachine.push(
      aiWaitState({
        id: "wait",
        sprite,
        waitFor: getRandomIntInclusive(500, 2000),
        onExit: () => (currentAction = AI_ACTIONS.IDLE)
      })
    );
  };

  const doRandomDest = ({ sprite, destination }) => {
    currentAction = AI_ACTIONS.MOVING;

    entityStateMachine.push(
      aiMoveToState({
        id: "moveTo",
        sprite,
        destination,
        onExit: () => (currentAction = AI_ACTIONS.THINKING)
      })
    );
  };

  /* Id should really be named 'class' since its re-used. */
  const sprite = Sprite({
    instId: uniqueId(id),
    id,
    type,
    name,
    x,
    y,
    z,
    anchor: { x: 0.5, y: 0.5 },
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    controlledByAI,
    collisionBodyOptions,
    manualAnimation,
    enableMovement: () => (movementDisabled = false),
    disableMovement: () => (movementDisabled = true),
    lookAt: ({ x, y }) => {
      flipSprite({
        direction: {
          x: sprite.x > x ? -1 : 1,
          y: sprite.y > y ? -1 : 1
        },
        sprite
      });
    },
    update: () => {
      entityStateMachine.update();

      switch (currentAction) {
        case AI_ACTIONS.IDLE:
          doRandomDest({
            sprite,
            destination: Vector(
              getRandomIntInclusive(30, 160),
              getRandomIntInclusive(30, 160)
            )
          });
          break;
        case AI_ACTIONS.THINKING:
          doRandomWait(sprite);
          break;
      }
    }
  });

  return sprite;
};
