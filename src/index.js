/* Credits
* Asset Pack:
* https://pixel-poem.itch.io/dungeon-assetpuck
* https://0x72.itch.io/dungeontileset-ii
* http://www.photonstorm.com/phaser/pixel-perfect-scaling-a-phaser-game
*/

/* Libs */
import { init, GameLoop, load, initKeys } from "kontra";

/* Common utils, objects and events */
import { circleCollision, sortByDist } from "./common/helpers";
import { ENTITY_TYPE } from "./common/consts";
import { allOff, on, emit, EV_SCENECHANGE } from "./common/events";

/* States for global use */
import startConvo from "./states/startConvoState";
import fieldState from "./states/fieldState";
import curtainState from "./states/curtainState";

/* Game managers */
import SceneManager from "./managers/sceneManager";
import WorldManager from "./managers/worldManager";
import ReactionManager from "./managers/reactionManager";
import StateMachine from "./managers/stateManager";

/* Screen size (16:9) */
const resolution = {
  width: 256,
  height: 192,
  scale: 4
};

/* Canvas initialization */
// Make absolutely sure we have to use two canvases (I'm not convinced)
const { canvas: gameCanvas } = init("gameCanvas");
const scaledCanvas = document.getElementById("scaledCanvas");

/* Our 'scaled' canvas (leaves original unchanged) */
scaledCanvas.width = resolution.width * resolution.scale;
scaledCanvas.height = resolution.height * resolution.scale;

/* Remove smoothing */
const gameCanvasCtx = gameCanvas.getContext("2d");
const ctx = scaledCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;

/* Primary field scene */
const FieldScene = sceneProps => {
  /* World creation */
  const { createWorld, savePickup, getAllEntitiesOfType } = WorldManager();
  const { sprites, player, tileEngine } = createWorld(sceneProps);

  let spriteCache = sprites.filter(spr => spr.isAlive());

  /* Main states creation */
  const sceneStateMachine = StateMachine();
  const screenEffectsStateMachine = StateMachine();

  /* Decide what happens on different player interaction events (was separated, seemed pointless at this stage) */
  const reactionManager = ReactionManager([
    {
      type: ENTITY_TYPE.DOOR,
      /* First available refers to the first given collision. So it might not always be what
      what you want it to be. This needs to be made a bit more robust. */
      reactionEvent: (interactible, actors = []) => {
        // TODO: Entities should manage their own animations (same problem seen elsewhere)
        interactible.playAnimation("open");
        screenEffectsStateMachine.push(
          curtainState({
            id: "curtain",
            ctx,
            direction: 1,
            onFadeComplete: () => {
              allOff([EV_SCENECHANGE]);
              /* Player start becomes part of the collider data so we attempt to use that. */
              emit(EV_SCENECHANGE, {
                areaId: interactible.customProperties.goesTo,
                playerStartId: interactible.customProperties.playerStartId
              });
            }
          })
        );
      }
    },
    {
      type: ENTITY_TYPE.PICKUP,
      reactionEvent: (interactible, actors = []) => {
        interactible.ttl = 0;
        savePickup(interactible);
      }
    },
    {
      type: ENTITY_TYPE.NPC,
      reactionEvent: (interactible, actors = []) =>
        sceneStateMachine.push(
          startConvo({
            id: "conversation",
            startId: "m1",
            // I feel these might be better done within the state... perhaps the same elsewhere too.
            onExit: () => actors.map(spr => (spr.movementDisabled = false)),
            onEntry: () => actors.map(spr => (spr.movementDisabled = true))
          })
        )
    }
  ]);

  // TODO: Can we please not have to pass everything in like this? It's a bit too coupled.
  /* Start game within FieldState */
  sceneStateMachine.push(
    fieldState({
      id: "field",
      sprites,
      tileEngine,
      reactionManager,
      getAllEntitiesOfType
    })
  );

  /* Open up the first scene with a fade */
  screenEffectsStateMachine.push(
    curtainState({
      id: "curtain",
      ctx,
      direction: -1
    })
  );

  /* Primary loop */
  return GameLoop({
    update: () => {
      /* Add a flag to sprite to enable/disable collision checks */
      /* Check for anything dead (GC does the rest) */
      spriteCache = spriteCache.filter(spr => spr.isAlive());

      /* Player to useable collision */
      const playerCollidingWith = sortByDist(
        player,
        circleCollision(player, spriteCache.filter(s => s.id !== "player"))
      );

      /* Update all sprites */
      spriteCache.map(sprite => sprite.update());

      // ...
      player.isColliding = playerCollidingWith.length > 0;

      /* Origin is the controller of the scene, so 9/10 that'll probably be the player */
      sceneStateMachine.update({
        origin: player,
        collisions: playerCollidingWith
      });

      /// Under serious testing
      // What's the significance of 64? Starting pos of player? Doesn't seem to matter... why?
      if (tileEngine.mapheight > resolution.height) {
        tileEngine.sy = player.y - 64;
      }

      if (tileEngine.mapwidth > resolution.width) {
        tileEngine.sx = player.x - 120;
      }
    },
    render: () => {
      /* Instruct tileEngine to update its frame */
      tileEngine.render();

      /* Edit z-order based on 'y' then change render order */
      spriteCache
        .sort((a, b) => Math.round(a.y - a.z) - Math.round(b.y - b.z))
        .forEach(sprite => sprite.render());

      /* Update any screen effects that are running */
      screenEffectsStateMachine.update();

      /* Project the actual game canvas on to the scaled canvas */
      ctx.drawImage(
        gameCanvas,
        0,
        0,
        resolution.width,
        resolution.height,
        0,
        0,
        scaledCanvas.width,
        scaledCanvas.height
      );
    }
  });
};

/* Make sure to embed your tilesets or it'll run in to problems,
TODO: Can we also const the dataKeys across the board plz. */
load(
  "assets/tileimages/test.png",
  "assets/tiledata/test.json",
  "assets/tiledata/test2.json",
  "assets/entityimages/little_devil.png",
  "assets/entityimages/little_orc.png",
  "assets/gameData/conversationData.json",
  "assets/gameData/entityData.json",
  "assets/gameData/worldData.json"
).then(assets => {
  initKeys();

  /// Note: There's now a scene manager in kontra that can be used
  // Hook up player start todo
  const sceneManager = SceneManager({ sceneObject: FieldScene });

  /* First load instigates a player start so this might be found from saveData
  or if at the very beginning of a game, passed in directly.
  If we look at the worldData, the playerStart id is actually linked to one of the
  entities that gets loaded in. This in theory means you can make anything a player start
  so long as you specify the right id for it. That being said, you do have to make sure
  both of them exist in the same context, otherwise you'll never get access to it.
  */
  sceneManager.loadScene({ areaId: "area1", playerStartId: "entrance" });

  on(EV_SCENECHANGE, props => sceneManager.loadScene({ ...props }));
});
