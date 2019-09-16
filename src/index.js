import {
  init,
  GameLoop,
  Sprite,
  load,
  TileEngine,
  dataAssets,
  keyPressed,
  initKeys
} from "kontra";

import { circleCollision, uniqueId } from "./helpers";

const { canvas } = init();

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;

const Scene = () => {
  initKeys();

  const mapKey = "assets/tiledata/test";
  const map = dataAssets[mapKey];
  const tileEngine = TileEngine(map);

  const player = Sprite({
    id: uniqueId("player_"),
    x: 120, // starting x,y position of the sprite
    y: 120,
    color: "red", // fill color of the sprite rectangle
    width: 16, // width and height of the sprite rectangle
    height: 16,
    collidesWithTiles: true,
    controlledByUser: true
  });

  let sprites = [];
  sprites.push(player);

  // Look here for collision -> https://straker.github.io/kontra/api/tileEngine#basic-use
  // Note: Not all tiles will have a type set, they should, but some get missed
  const walls = tileEngine.tilesets[0].tiles.filter(
    t => t.properties.find(prop => prop.name === "type").value === 1
  );

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

        /* To move later on (don't forget to divide the diag movement to stop double speed - TODO) */
        const dir = sprite.controlledByUser
          ? {
              x: keyPressed("a") ? -1 : keyPressed("d") ? 1 : 0,
              y: keyPressed("w") ? -1 : keyPressed("s") ? 1 : 0
            }
          : { x: 0, y: 0 }; // AI

        /// For collisions with tiles
        let oldPos = {
          x: sprite.x,
          y: sprite.y
        };

        // Move X then check X
        sprite.x += dir.x;

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

        // Move Y then check Y
        sprite.y += dir.y;

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
load("assets/tileimages/test.png", "assets/tiledata/test.json").then(assets => {
  const newScene = Scene();
  newScene.start();
});
