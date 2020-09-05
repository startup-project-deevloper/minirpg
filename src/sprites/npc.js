import StateMachine from "../managers/stateManager";
import aiFollowPathState from "../states/aiFollowPathState";
import aiIdleState from "../states/aiIdleState";
import { flipSprite } from "../common/spriteFunctions";
import { uniqueId, getRandomIntInclusive } from "../common/helpers";
import { wait } from "../common/aiHelpers";
import { Sprite, imageAssets, SpriteSheet } from "kontra";

// TODO: Considering looking at an FSM lib...
const Brain = () => {
  const entityStateMachine = StateMachine();
  let brainData = {};

  /* Push an idle state to kick things off (can probably make this in to
      json data later on and auto-create all this) */
  const behaviours = {
    talkMode: () => {
      entityStateMachine.push(
        aiIdleState({
          props: {
            sprite: brainData.sprite
          }
        })
      );
    },
    idleAndRoam: () => {
      entityStateMachine.push(
        aiIdleState({
          props: {
            sprite: brainData.sprite
          },
          onEntry: async () => {
            // Sticking this here rather than in update. No idea if it's right.
            await wait(getRandomIntInclusive(500, 1500));
            entityStateMachine.popState("idle");
          },
          onExit: () => behaviours.followPath()
        })
      );
    },
    followPath: () => {
      entityStateMachine.push(
        aiFollowPathState({
          props: brainData,
          onExit: () => {
            // Hmm... this is a bit weird I feel...
            behaviours.idleAndRoam();
          }
        })
      );
    }
  };

  return {
    bootstrap: props => (brainData = { ...props }),
    update: () => entityStateMachine.update(),
    start: () => behaviours.idleAndRoam(),
    talkMode: () => {
      // TODO: Bug, sometimes stops animations when you clear state like this.
      entityStateMachine.clearStates();
      behaviours.talkMode()
    },
    reset: () => {
      entityStateMachine.clearStates();
      behaviours.idleAndRoam();
    }
  };
};

export default ({
  id,
  x,
  y,
  z = 1,
  customProperties = {},
  entityData = null,
  aiPathGrid = null,
  collisionMethod = (layer, sprite) => { }
}) => {
  if (!id) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

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
    collidesWithTiles = true,
    collidesWithPlayer = true
  } = entityData;

  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });

  const myBrain = Brain();

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
    collisionBodyOptions,
    collidesWithPlayer,
    manualAnimation,
    enableMovement: () => myBrain.reset(),
    disableMovement: () => myBrain.talkMode(),
    lookAt: ({ x, y }) => {
      flipSprite({
        direction: {
          x: sprite.x > x ? -1 : 1,
          y: sprite.y > y ? -1 : 1
        },
        sprite
      });
    },
    update: () => myBrain.update()
  });

  myBrain.bootstrap({ sprite, aiPathGrid });
  myBrain.start();

  return sprite;
};
