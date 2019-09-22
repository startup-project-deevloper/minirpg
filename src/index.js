/* Credits
* Asset Pack:
* https://pixel-poem.itch.io/dungeon-assetpuck
* https://0x72.itch.io/dungeontileset-ii
*/
import {
  init,
  GameLoop,
  load,
  TileEngine,
  dataAssets,
  keyPressed,
  initKeys
} from "kontra";
import UI from "./ui";
import Cache from "./cache";
import { circleCollision } from "./helpers";
import Entity from "./entity";
import ConversationIterator from "./conversationIterator";
import StateMachine from "./fsm";
import blankState from "./states/blankState";
import startConvo from "./states/startConvo";

import { mainFlow } from "./data";

const gameCache = Cache.create("gameCache");
gameCache.add("progress", {
  storyProgress: null
});

const { canvas } = init();

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
ctx.scale(3, 3);

const convoIterator = ConversationIterator({
  collection: mainFlow,
  onChatComplete: lastPositionSaved => {
    console.log("Exited:", lastPositionSaved);
  },
  onChainProgress: lastNodeId => {
    gameCache.set("progress", {
      storyProgress: lastNodeId
    });
  }
});

const Scene = () => {
  initKeys();

  const mapKey = "assets/tiledata/test";
  const map = dataAssets[mapKey];
  const tileEngine = TileEngine(map);

  const player = Entity({
    x: 120,
    y: 120,
    sheet: "assets/entityimages/little_devil.png",
    name: "Player",
    id: "player",
    controlledByUser: true
  });

  const npc = Entity({
    x: 120,
    y: 160,
    name: "Daryl",
    id: "daryl",
    sheet: "assets/entityimages/little_orc.png"
  });

  let sprites = [player, npc];

  let appMode = 0;

  const sceneStateMachine = StateMachine({
    states: [
      blankState({
        id: "field",
        cache: gameCache,
        onEntry: () => (appMode = 0)
      }),
      startConvo({
        id: "conversation",
        sprites,
        convoIterator,
        onEntry: () => (appMode = 1)
      })
    ]
  });

  return GameLoop({
    update: () => {
      sceneStateMachine.update();

      if (appMode === 1) {
        sprites.map(sprite => {
          sprite.playAnimation("idle");
          sprite.update();
        });

        return;
      }

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

        // Collider check
        const collidedWithY = tileEngine.layerCollidesWith("Collision", sprite);

        if (sprite.collidesWithTiles && collidedWithY) {
          sprite.x = oldPos.x;
          sprite.y = oldPos.y;
        }

        /// For collisions with other sprites (you could optimise further with distance too)
        if (sprite.controlledByUser && keyPressed("e")) {
          const collidingWith = circleCollision(
            sprite,
            sprites.filter(s => s.id !== sprite.id)
          );

          sprite.isColliding = collidingWith.length > 0;

          if (sprite.isColliding) {
            sceneStateMachine.setState("conversation", {
              ...collidingWith[0]
            });
          }
        }

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
  "assets/entityimages/little_devil.png",
  "assets/entityimages/little_orc.png"
).then(assets => {
  Scene().start();
  UI({ convoIterator }).start();
});
