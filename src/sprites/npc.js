import StateMachine from "../managers/stateManager";
import damagedState from "../states/damagedState";
import healthyState from "../states/healthyState";
import { moveSprite, flipSprite } from "./spriteFunctions";
import { uniqueId, dist, getRandomIntInclusive } from "../common/helpers";
import { Sprite, imageAssets, SpriteSheet, Vector } from "kontra";

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
  let current = Vector(0, 0);

  // ...
  let destination = Vector(30, 160);

  //current = current.add(direction.normalize());

  let targetDestination = null;
  let movementDisabled = false;

  let stopThinking = false;

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
    onAttacked: () => {
      // Push an internal state for damage effect (whatever that's going to be)
      console.log(id);
    },
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

      //let direction = current.subtract(destination);
      //current = current.add(direction);

      if (targetDestination !== null && !stopThinking) {
        /* You could also stick pathfinding in here or in AI when it's implemented */
        // dir = {
        //   x: sprite.x > targetDestination.x ? -1 : 1,
        //   y: sprite.y > targetDestination.y ? -1 : 1
        // };
        // Don't rely on this, it's just a test
        // if (dist(sprite, targetDestination) < 1) {
        //   stopThinking = true;
        //   const waitFor = getRandomIntInclusive(1000, 4000);
        //   dir = { x: 0, y: 0 };
        //   setTimeout(() => {
        //     targetDestination = null;
        //     stopThinking = false;
        //   }, waitFor);
        // }
      } else {
        // Again I don't like the flag being like this. Should be a separate entity altogether really. but can test
        // a roaming AI at least.
        // if (!targetDestination) {
        //   targetDestination = {
        //     x: getRandomIntInclusive(90, 120),
        //     y: getRandomIntInclusive(90, 120)
        //   };
        // }
      }

      // const { directionNormal } = moveSprite({
      //   // dir:
      //   //   movementDisabled && targetDestination === null ? { x: 0, y: 0 } : dir,
      //   dir: direction,
      //   sprite,
      //   checkCollision: (sprite) => collisionMethod("Collision", sprite)
      // });

      // Note: No need for acc at this stage
      // TODO: Make speed value a config =========================v
      let vel = Vector(0, 0);

      // Durrent vector towards target
      let distanceToTarget = destination.subtract(current).length();

      // Cease all movement if arrived, otherwise just carry on
      if (distanceToTarget > 10) {
        vel = destination.subtract(current).normalize().scale(0.5);

        sprite.x += vel.x;
        sprite.y += vel.y;

        current = Vector(sprite.x, sprite.y);
      } else {
        destination = current;
      }

      //flipSprite({ direction: directionNormal, sprite });
      flipSprite({ direction: vel, sprite });

      // Do some animations
      //const isMoving = directionNormal.x !== 0 || directionNormal.y !== 0;
      const isMoving = vel.x !== 0 || vel.y !== 0;

      if (!sprite.manualAnimation) {
        sprite.playAnimation(isMoving ? "walk" : "idle");
      }

      // Call this to ensure animations are player
      sprite.advance();
    }
  });

  // Temporary
  current = Vector(sprite.x, sprite.y);

  return sprite;
};
