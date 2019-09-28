/* Credits
* Asset Pack:
* https://pixel-poem.itch.io/dungeon-assetpuck
* https://0x72.itch.io/dungeontileset-ii
*/
import { init, GameLoop, load, initKeys, keyPressed } from "kontra";
import UI from "./ui";
import Entity from "./entity";
import StateMachine from "./fsm";
import startConvo from "./states/startConvo";
import {
  emit,
  on,
  EV_CONVOEND,
  EV_SCENECHANGE,
  EV_CONVOCHOICE
} from "./events";
import { circleCollision } from "./helpers";
import { ENTITY_TYPE } from "./consts";
import fieldState from "./states/fieldState";
import curtainState from "./states/curtainState";

import SceneManager from "./sceneManager";
import WorldManager from "./worldManager";
import ConversationManager from "./conversationManager";

const { canvas } = init();

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
ctx.scale(3, 3);

const FieldScene = ({ areaId }) => {
  /* World creation */
  const { createWorld } = WorldManager();
  const { loadedEntities, tileEngine } = createWorld({ areaId });

  /* Dialogue creation */
  const { goToExact, goToNext, start } = ConversationManager();

  /* All but the player are generated here */
  const player = Entity({
    x: 0,
    y: 0,
    name: "Player",
    id: "player",
    assetId: "player",
    controlledByUser: true
  });

  /* TODO: make immutable? */
  let sprites = [player, ...loadedEntities];

  const sceneStateMachine = StateMachine();
  const screenEffectsStateMachine = StateMachine();

  sceneStateMachine.push(
    fieldState({
      id: "field",
      sprites,
      canvas,
      tileEngine
    })
  );

  screenEffectsStateMachine.push(
    curtainState({
      id: "curtain",
      ctx,
      direction: 1
    })
  );

  // Experimental
  const reactionRegister = {
    [ENTITY_TYPE.DOOR]: (firstAvailable, sprites) => {
      firstAvailable.playAnimation("open");

      screenEffectsStateMachine.push(
        curtainState({
          id: "curtain",
          ctx,
          direction: -1,
          onFadeComplete: () => {
            emit(EV_SCENECHANGE, {
              areaId: firstAvailable.customProperties.goesTo
            });
          }
        })
      );
    },
    [ENTITY_TYPE.PICKUP]: (firstAvailable, sprites) => {
      firstAvailable.ttl = 0;
    },
    [ENTITY_TYPE.NPC]: (firstAvailable, sprites) => {
      sceneStateMachine.push(
        startConvo({
          id: "conversation",
          sprites,
          onNext: props => {
            goToNext({
              currentActors: sprites
            });
          },
          onEntry: props => {
            start("m1", {
              // This needs plugging in
              currentActors: sprites
            });
          }
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
        const reaction = reactionRegister[firstAvailable.type];

        /* Not all things will have a reaction set */
        if (reaction) {
          reaction(firstAvailable, sprites);
        }
      } else {
        justTriggered = false;
      }

      pushed = true;
    } else if (pushed && !keyPressed("e")) {
      pushed = false;
    }
  };

  const entranceMarker = sprites.find(x => x.id === "entranceMarker");

  if (entranceMarker) {
    player.x = entranceMarker.x;
    player.y = entranceMarker.y;
  }

  // Experimental
  on(EV_CONVOEND, () => {
    sceneStateMachine.pop();
    justTriggered = true;
  });

  on(EV_CONVOCHOICE, choice =>
    goToExact(choice.to, {
      currentActors: sprites
    })
  );
  //

  return GameLoop({
    update: () => {
      sceneStateMachine.update();
      screenEffectsStateMachine.update();

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

      /* Edit z-order based on 'y' then change render order */
      sprites
        .sort((a, b) => Math.round(a.y - a.z) - Math.round(b.y - b.z))
        .forEach(sprite => sprite.render());
    }
  });
};

/* Make sure to embed your tilesets or it'll run in to problems,
TODO: Can we also const the dataKeys across the board plz. */
load(
  "assets/tileimages/test.png",
  "assets/tiledata/test.json",
  "assets/entityimages/little_devil.png",
  "assets/entityimages/little_orc.png",
  "assets/gameData/conversationData.json",
  "assets/gameData/entityData.json",
  "assets/gameData/worldData.json"
).then(assets => {
  const sceneManager = SceneManager({ sceneObject: FieldScene });

  UI({
    onConversationChoice: choice => emit(EV_CONVOCHOICE, choice)
  }).start();

  initKeys();

  sceneManager.loadScene({ areaId: "area1" });

  on(EV_SCENECHANGE, sceneManager.loadScene);
});
