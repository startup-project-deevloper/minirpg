/* Credits
* Asset Pack:
* https://pixel-poem.itch.io/dungeon-assetpuck
* https://0x72.itch.io/dungeontileset-ii
*/
import {
  init,
  GameLoop,
  Sprite,
  load,
  TileEngine,
  dataAssets,
  imageAssets,
  keyPressed,
  initKeys,
  SpriteSheet
} from "kontra";

import { circleCollision, uniqueId } from "./helpers";

const { canvas } = init();

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;

const Entity = ({ sheet }) => {
  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth: 16,
    frameHeight: 16,
    animations: {
      idle: {
        frames: [0, 1, 2, 3],
        frameRate: 8
      },
      walk: {
        frames: [3, 4, 5, 6, 7],
        frameRate: 16
      }
    }
  });

  return Sprite({
    id: uniqueId("ety_"),
    x: 120,
    y: 120,
    animations: spriteSheet.animations,
    collidesWithTiles: true,
    controlledByUser: true
  });
};

const Scene = () => {
  initKeys();

  const mapKey = "assets/tiledata/test";
  const map = dataAssets[mapKey];
  const tileEngine = TileEngine(map);

  const player = Entity({
    sheet: "assets/entityimages/little_devil.png"
  });

  let sprites = [];
  sprites.push(player);

  return GameLoop({
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
        const dirLength = Math.sqrt(dir.x * dir.x + dir.y * dir.y)

        const dirNormal = {
          x: dir.x !== 0 ? dir.x / dirLength : 0,
          y: dir.y !== 0 ? dir.y / dirLength : 0
        }

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

        // Collider check
        const collidedWithY = tileEngine.layerCollidesWith("Collision", sprite);

        if (sprite.collidesWithTiles && collidedWithY) {
          sprite.x = oldPos.x;
          sprite.y = oldPos.y;
        }

        /// For collisions with other sprites
        // sprite.isColliding = circleCollision(
        //   sprite,
        //   sprites.filter(s => s.id !== sprite.id)
        // );

        // Flip the sprite
        if (dirNormal.x < 0) {
          sprite.width = -sprite.width;
        } else if (dirNormal.x > 0) {
          sprite.width = sprite.width;
        }

        // Do some animations
        const isMoving = dirNormal.x !== 0 || dirNormal.y !== 0;
        sprite.playAnimation(isMoving ? "walk" : "idle");

        // Don't update until you've calcs positions
        sprite.update();
      });
    },
    render: () => {
      tileEngine.render();
      sprites.map(sprite => sprite.render());
    }
  });
};

/* Make sure to embed your tilesets or it'll run in to problems */
load(
  "assets/tileimages/test.png",
  "assets/tiledata/test.json",
  "assets/entityimages/little_devil.png"
).then(assets => Scene().start());
