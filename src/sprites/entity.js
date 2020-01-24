import { moveSprite, flipSprite } from "./spriteFunctions";
import { uniqueId, dist } from "../common/helpers";
import {
  Sprite,
  dataAssets,
  imageAssets,
  SpriteSheet,
  keyPressed
} from "kontra";

export default ({
  id,
  x,
  y,
  z = 1,
  customProperties = {},
  collisionMethod = (layer, sprite) => {}
}) => {
  if (!id) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

  const dataKey = "assets/gameData/entityData.json";
  const entityData = dataAssets[dataKey];

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
    collidesWithTiles = true
  } = entityData.find(ent => ent.id === id);

  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });

  let dir = { x: 0, y: 0 }; // AI (to add later)
  let targetDestination = null;
  let movementDisabled = false;
  let destinationReachedCallback = null;

  /* Id should really be named 'class' since its re-used. */
  const sprite = Sprite({
    instId: uniqueId(id),
    id,
    type,
    name,
    x,
    y,
    z,
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
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
    moveTo: ({ x, y }, onDestinationReached = null) => {
      // Look at: https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-angular-movement/a/pointing-towards-movement
      /* Direct moveTo (naive approach) */
      targetDestination = {
        x,
        y
      };

      destinationReachedCallback = onDestinationReached;
    },
    update: () => {
      /* Movement */
      if (targetDestination !== null) {
        /* You could also stick pathfinding in here or in AI when it's implemented */
        dir = {
          x: sprite.x > targetDestination.x ? -1 : 1,
          y: sprite.y > targetDestination.y ? -1 : 1
        };

        if (dist(sprite, targetDestination) < 1) {
          targetDestination = null;

          if (destinationReachedCallback != null) {
            destinationReachedCallback();
            destinationReachedCallback = null;
          }
        }
      } else if (controlledByUser && targetDestination == null) {
        dir = {
          x: keyPressed("a") ? -1 : keyPressed("d") ? 1 : 0,
          y: keyPressed("w") ? -1 : keyPressed("s") ? 1 : 0
        };
      } else {
        dir = {
          x: 0,
          y: 0
        };
      }

      const { directionNormal } = moveSprite({
        dir:
          movementDisabled && targetDestination === null ? { x: 0, y: 0 } : dir,
        sprite,
        checkCollision: sprite => collisionMethod("Collision", sprite)
      });

      // Flip the sprite on movement
      flipSprite({ direction: directionNormal, sprite });

      // Do some animations
      const isMoving = directionNormal.x !== 0 || directionNormal.y !== 0;
      if (!sprite.manualAnimation) {
        sprite.playAnimation(isMoving ? "walk" : "idle");
      }

      // Call this to ensure animations are player
      sprite.advance();
    }
  });

  // console.log("=> Sprite generated:", sprite.name, sprite.id);
  // console.log(sprite);

  return sprite;
};
