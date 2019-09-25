import { keyPressed } from "kontra";

export default ({
  id,
  sprites,
  canvas,
  tileEngine,
  onEntry = () => {},
  onExit = () => {}
}) => {
  let isComplete = false;

  return {
    id,
    isComplete: () => isComplete,
    enter: props => {
      onEntry();
    },
    update: () => {
      sprites.map(sprite => {
        // sprite is beyond the left edge
        if (sprite.x < 0) {
          sprite.x = canvas.width;
        } else if (sprite.x > canvas.width) {
          // sprite is beyond the right edge
          sprite.x = 0;
        }
        // sprite is beyond the top edge
        if (sprite.y < 0) {
          sprite.y = canvas.height;
        } else if (sprite.y > canvas.height) {
          // sprite is beyond the bottom edge
          sprite.y = 0;
        }

        /* To move later on */
        const dir = sprite.controlledByUser
          ? {
              x: keyPressed("a") ? -1 : keyPressed("d") ? 1 : 0,
              y: keyPressed("w") ? -1 : keyPressed("s") ? 1 : 0
            }
          : { x: 0, y: 0 }; // AI

        /* Normalise so you don't go super fast diagonally */
        const dirLength = Math.sqrt(dir.x * dir.x + dir.y * dir.y);

        const dirNormal = {
          x: dir.x !== 0 ? dir.x / dirLength : 0,
          y: dir.y !== 0 ? dir.y / dirLength : 0
        };

        /// For collisions with tiles
        let oldPos = {
          x: sprite.x,
          y: sprite.y
        };

        // Move X then check X (careful editing directly, might lead to issues with camera)
        sprite.x += dirNormal.x;

        // Collider check
        const collidedWithX = tileEngine.layerCollidesWith("Collision", sprite);

        if (sprite.collidesWithTiles && collidedWithX) {
          sprite.x = oldPos.x;
          sprite.y = oldPos.y;
        }

        // Update old pos ref
        oldPos = {
          x: sprite.x,
          y: sprite.y
        };

        // Move Y then check Y (careful editing directly, might lead to issues with camera)
        sprite.y += dirNormal.y;

        // Collider check against tiles
        const collidedWithY = tileEngine.layerCollidesWith("Collision", sprite);

        if (sprite.collidesWithTiles && collidedWithY) {
          sprite.x = oldPos.x;
          sprite.y = oldPos.y;
        }

        // Flip the sprite on movement
        if (dirNormal.x < 0) {
          sprite.width = -sprite.width;
        } else if (dirNormal.x > 0) {
          sprite.width = sprite.width;
        }

        // Do some animations
        const isMoving = dirNormal.x !== 0 || dirNormal.y !== 0;
        if (!sprite.manualAnimation) {
          sprite.playAnimation(isMoving ? "walk" : "idle");
        }

        // Don't update until you've calcs positions
        sprite.update();
      });
    },
    exit: () => {
      onExit();
    }
  };
};
