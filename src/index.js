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
  keyPressed,
  setStoreItem
} from "kontra";
import UI from "./ui";
import Entity from "./entity";
import ConversationIterator from "./conversationIterator";
import StateMachine from "./fsm";
import startConvo from "./states/startConvo";
import { emit, on, EV_CONVONEXT, EV_CONVOSTART, EV_CONVOEND } from "./events";
import { circleCollision } from "./helpers";
import { mainFlow, ENTITY_TYPE } from "./data";
import fieldState from "./states/fieldState";

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
  onChatStarted: (node, passedProps = {}) =>
    emit(EV_CONVOSTART, { node, passedProps }),
  onChatNext: (node, passedProps = {}) =>
    emit(EV_CONVONEXT, { node, passedProps }),
  onChatComplete: exitId => emit(EV_CONVOEND, { exitId }),
  onChainProgress: lastNodeId => {
    setStoreItem("progress", {
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
  // Shouldn't really pass sprites just to play their anims, they should be self-managed.
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

  // You could move a lot if not all of these properties out
  const player = Entity({
    x: 120,
    y: 120,
    sheet: "assets/entityimages/little_devil.png",
    name: "Player",
    id: "player",
    assetId: "player",
    controlledByUser: true
  });

  const npc = Entity({
    x: 120,
    y: 160,
    name: "Daryl",
    id: "daryl",
    assetId: "standard_npc",
    sheet: "assets/entityimages/little_orc.png"
  });

  const potion = Entity({
    x: 156,
    y: 72,
    name: "Potion",
    id: "potion",
    assetId: "standard_potion",
    sheet: "assets/tileimages/test.png"
  });

  let sprites = [player, npc, potion];

  const sceneStateMachine = StateMachine();

  sceneStateMachine.push(
    createFieldState({
      sprites,
      canvas,
      tileEngine
    })
  );

  // Experimental
  const reactionRegister = {
    [ENTITY_TYPE.PICKUP]: (firstAvailable, sprites) => {
      firstAvailable.ttl = 0;
      console.log("Pick me up:", firstAvailable);
      console.log(firstAvailable.isAlive());
    },
    [ENTITY_TYPE.NPC]: (firstAvailable, sprites) => {
      sceneStateMachine.push(
        createConversationState({
          sprites
        }),
        {
          currentActors: sprites.find(spr => spr.id === firstAvailable.id)
        }
      );
    }
  };

  let pushed = false;
  let justTriggered = false;
  const onCollisionDetected = (origin, colliders = []) => {
    if (
      colliders.length &&
      origin.controlledByUser &&
      keyPressed("e") &&
      !pushed
    ) {
      if (!justTriggered) {
        const firstAvailable = colliders[0];
        reactionRegister[firstAvailable.type](firstAvailable, sprites);
      } else {
        justTriggered = false;
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
    justTriggered = true;
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

      let collisions = [];

      /* Check for anything dead (GC does the rest) */
      sprites = sprites.filter(spr => spr.isAlive());

      /* Add a flag to sprite to enable/disable collision checks */
      sprites.map(sprite => {
        const collidingWith = circleCollision(
          sprite,
          sprites.filter(s => s.id !== sprite.id)
        );

        sprite.isColliding = collidingWith.length > 0;

        if (sprite.isColliding) {
          collisions.push(sprite);
        }
      });

      /* This would be a great place to sort by distance also. */
      onCollisionDetected(player, collisions.filter(c => c.id !== player.id));
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
