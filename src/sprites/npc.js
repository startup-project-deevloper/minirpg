import EasyStar from "easystarjs";
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
  aiPathGrid = null,
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

  console.log(aiPathGrid)

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

  const goToDestination = ({ sprite, destination }) => {
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

  const findRandomDest = () => {
    
    currentAction = AI_ACTIONS.THINKING;

    console.log("Looking for a random path on the ai grid...");

    // TODO: Not sure you'll want to do this every single time.
    const easystar = new EasyStar.js();
    
    easystar.enableDiagonals();
    easystar.setGrid(aiPathGrid);
    easystar.setAcceptableTiles([102]);
    
    /* Find a path within the bounds of what we have available, I've no idea how to do it yet. Perhaps
    find the x,y of every walkable by finding out its place in the array? Unsure on how to
    work out current position however... tileEngine has a method but, do I really want to
    pass the entire object ref through? Rounding won't work either. */
    // sx, sy, ex, ey (tile-wise, will need to convert back to pixels later for px dest)
    easystar.findPath(5, 6, 8, 6, function(path) {
      if (path === null) {
        console.log("Path was not found.");
      } else {
        console.log(
          "Path was found. The first Point is " + path[0].x + " " + path[0].y
        );
        console.log(path);
      }
    });
    
    // Just calculate once (if you run in to issues, may need to do it every frame. Def so for a changing map landscape)
    easystar.calculate();
    
    // If you have your path, add it to the queue lib then start chomping through.

    //////
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
          findRandomDest({
            sprite
          });
          break;
        case AI_ACTIONS.THINKING:
          // ... Do nothing until fulfilled.
          break;
      }
    }
  });

  return sprite;
};
