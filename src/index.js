/* Credits
* Asset Pack:
* https://pixel-poem.itch.io/dungeon-assetpuck
* https://0x72.itch.io/dungeontileset-ii
*/

/* Libs */
import { init, GameLoop, load, initKeys } from "kontra";

/* Common utils, objects and events */
import Entity from "./sprites/entity";
import { circleCollision, sortByDist } from "./common/helpers";
import { ENTITY_TYPE } from "./common/consts";
import {
  allOff,
  on,
  emit,
  EV_SCENECHANGE
} from "./common/events";

/* States for global use */
import startConvo from "./states/startConvo";
import fieldState from "./states/fieldState";
import curtainState from "./states/curtainState";

/* Game managers */
import SceneManager from "./managers/sceneManager";
import WorldManager from "./managers/worldManager";
import ReactionManager from "./managers/reactionManager";
import StateMachine from "./managers/stateManager";

/* Canvas initialization */
const { canvas } = init();
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
ctx.scale(3, 3);

/* Primary field scene (playerStartId is optional) */
const FieldScene = ({ areaId, playerStartId }) => {
  /* World creation */
  const { createWorld, saveEntityState } = WorldManager();
  const { loadedEntities, tileEngine } = createWorld({ areaId });

  /* Main states creation */
  const sceneStateMachine = StateMachine();
  const screenEffectsStateMachine = StateMachine();

  /* All but the player are generated here */
  const playerStart = loadedEntities.find(x => x.id === playerStartId);

  const player = Entity({
    x: playerStart ? playerStart.x : 128,
    y: playerStart ? playerStart.y : 128,
    name: "Player",
    id: "player",
    assetId: "player",
    controlledByUser: true,
    tileEngine
  });

  /* Sprites collection for easier render / updates */
  let sprites = [player, ...loadedEntities];

  /* Decide what happens on different player interaction events (was separated, seemed pointless at this stage) */
  const reactionManager = ReactionManager([
    {
      type: ENTITY_TYPE.DOOR,
      /* First available refers to the first given collision. So it might not always be what
      what you want it to be. This needs to be made a bit more robust. */
      reactionEvent: firstAvailable => {
        // TODO: Entities should manage their own animations (same problem seen elsewhere)
        firstAvailable.playAnimation("open");

        screenEffectsStateMachine.push(
          curtainState({
            id: "curtain",
            ctx,
            direction: -1,
            onFadeComplete: () => {
              allOff([EV_SCENECHANGE]);
              /* Player start becomes part of the collider data so we attempt to use that. */
              emit(EV_SCENECHANGE, {
                areaId: firstAvailable.customProperties.goesTo,
                playerStartId: firstAvailable.customProperties.playerStartId
              });
            }
          })
        );
      }
    },
    {
      type: ENTITY_TYPE.PICKUP,
      reactionEvent: firstAvailable => {
        firstAvailable.ttl = 0;
        saveEntityState(firstAvailable);
      }
    },
    {
      type: ENTITY_TYPE.NPC,
      reactionEvent: actorsInvolved =>
        sceneStateMachine.push(
          startConvo({
            id: "conversation",
            startId: "m1",
            onExit: () => {
              actorsInvolved.map(spr => (spr.movementDisabled = false));
              sceneStateMachine.pop();
            },
            onEntry: () => actorsInvolved.map(spr => (spr.movementDisabled = true))
          })
        )
    }
  ]);

  /* Start game within FieldState */
  sceneStateMachine.push(
    fieldState({
      id: "field",
      sprites,
      tileEngine,
      reactionManager
    })
  );

  /* Open up the first scene with a fade */
  screenEffectsStateMachine.push(
    curtainState({
      id: "curtain",
      ctx,
      direction: 1
    })
  );

  /* Primary loop */
  return GameLoop({
    update: () => {
      let collisions = [];

      /* Check for anything dead (GC does the rest) */
      sprites = sprites.filter(spr => spr.isAlive());

      /* Player to useable collision */
      const playerCollidingWith = sortByDist(player, circleCollision(
        player,
        sprites.filter(s => s.id !== "player")
      ));

      /* Update all sprites */
      sprites.map(sprite => sprite.update());

      // ...
      player.isColliding = playerCollidingWith.length > 0;

      /* Origin is the controller of the scene, so 9/10 that'll probably be the player */
      sceneStateMachine.update({
        origin: player,
        collisions: playerCollidingWith
      });

      /* Add a flag to sprite to enable/disable collision checks */
      // sprites.map(sprite => {
      //   sprite.update();

      //   /* This is a bit flawed as we check for collision events on every sprite when in reality we only need it
      //   for say the player. Or, more to the point, only certain collisions apply in certain contexts. If a player walks to
      //   a door, we only need for the player to detect the collision and trigger an action. The door can just be a prop. */
      //   const collidingWith = circleCollision(
      //     sprite,
      //     sprites.filter(s => s.id !== sprite.id)
      //   );

      //   sprite.isColliding = collidingWith.length > 0;

      //   if (sprite.isColliding) {
      //     collisions.push(sprite);
      //   }
      // });
    },
    render: () => {
      tileEngine.render();

      /* Edit z-order based on 'y' then change render order */
      sprites
        .sort((a, b) => Math.round(a.y - a.z) - Math.round(b.y - b.z))
        .forEach(sprite => sprite.render());

      screenEffectsStateMachine.update();
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
  initKeys();

  // Hook up player start todo
  const sceneManager = SceneManager({ sceneObject: FieldScene });

  /* First load instigates a player start so this might be found from saveData
  or if at the very beginning of a game, passed in directly.
  If we look at the worldData, the playerStart id is actually linked to one of the
  entities that gets loaded in. This in theory means you can make anything a player start
  so long as you specify the right id for it. That being said, you do have to make sure
  both of them exist in the same context, otherwise you'll never get access to it.
  */
  sceneManager.loadScene({ areaId: "area1", playerStartId: "saveGameStartLocation" });

  on(EV_SCENECHANGE, props => sceneManager.loadScene({ ...props }));
});
