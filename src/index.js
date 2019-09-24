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
  initKeys,
  keyPressed
} from "kontra";
import UI from "./ui";
import Cache from "./cache";
import Entity from "./entity";
import ConversationIterator from "./conversationIterator";
import StateMachine from "./fsm";
import startConvo from "./states/startConvo";
import { emit, on, EV_CONVONEXT, EV_CONVOSTART, EV_CONVOEND } from "./events";
import { circleCollision } from "./helpers";
import { mainFlow } from "./data";
import fieldState from "./states/fieldState";

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
  onChatStarted: (node, passedProps = {}) => {
    emit(EV_CONVOSTART, { node, passedProps });
  },
  onChatNext: (node, passedProps = {}) => {
    emit(EV_CONVONEXT, { node, passedProps });
  },
  onChatComplete: exitId => {
    emit(EV_CONVOEND, { exitId });
  },
  onChainProgress: lastNodeId => {
    gameCache.update("progress", {
      storyProgress: lastNodeId
    });
  }
});

const createFieldState = ({ sprites, canvas, tileEngine }) => {
  return fieldState({
    id: "field",
    sprites,
    canvas,
    tileEngine
  });
};

const createConversationState = ({ sprites }) => {
  return startConvo({
    id: "conversation",
    sprites,
    onNext: props => {
      convoIterator.goToNext({
        currentActors: sprites
      });
    },
    onEntry: props => {
      convoIterator.start("m1", {
        currentActors: sprites
      });
    }
  });
};

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

  const sceneStateMachine = StateMachine();

  sceneStateMachine.push(
    createFieldState({
      sprites,
      canvas,
      tileEngine
    })
  );

  // Experimental
  let pushed = false;
  let justTalked = false;
  const onCollisionDetected = (origin, colliders) => {
    if (origin.controlledByUser && keyPressed("e") && !pushed) {
      if (!justTalked) {
        sceneStateMachine.push(
          createConversationState({
            sprites
          }),
          {
            currentActors: sprites
          }
        );
      } else {
        justTalked = false;
      }

      pushed = true;
    } else if (pushed && !keyPressed("e")) {
      pushed = false;
    }
  };
  //

  // Experimental
  on(EV_CONVOEND, () => {
    sceneStateMachine.pop();
    justTalked = true;
  });
  //

  UI({
    onConversationChoice: choice => {
      convoIterator.goToExact(choice.to, {
        currentActors: sprites
      });
    }
  }).start();

  return GameLoop({
    update: () => {
      sceneStateMachine.update();

      sprites.map(sprite => {
        const collidingWith = circleCollision(
          sprite,
          sprites.filter(s => s.id !== sprite.id)
        );

        sprite.isColliding = collidingWith.length > 0;

        if (sprite.isColliding) {
          onCollisionDetected(sprite, collidingWith);
        }
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
});
