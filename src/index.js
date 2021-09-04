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
import {
  allOff,
  on,
  emit,
  EV_SCENECHANGE,
  EV_UPDATECONVOTRIGGER,
  EV_GIVEQUEST,
  EV_UPDATEQUEST,
  EV_ITEMOBTAINED
} from "./common/events";

/* Store services */
import store from "./services/store";

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
  scale: 3
};

/* Canvas initialization */
// Make absolutely sure we have to use two canvases (I'm not convinced)
const { canvas: gameCanvas } = init("gameCanvas");
const scaledCanvas = document.getElementById("scaledCanvas");
const rootElement = document.getElementById("root");

/* Set correct scales to be universal */
gameCanvas.width = resolution.width;
gameCanvas.height = resolution.height;

/* Scaled canvas works in the same way only we multiply to zoom it in */
scaledCanvas.width = resolution.width * resolution.scale;
scaledCanvas.height = resolution.height * resolution.scale;

/* Apply to root element also */
rootElement.style.width = resolution.width * resolution.scale + "px";
rootElement.style.height = resolution.height * resolution.scale + "px";

/* Remove smoothing */
const gameCanvasCtx = gameCanvas.getContext("2d");
gameCanvasCtx.imageSmoothingEnabled = false;
gameCanvasCtx.webkitImageSmoothingEnabled = false;
gameCanvasCtx.mozImageSmoothingEnabled = false;
gameCanvasCtx.msImageSmoothingEnabled = false;
gameCanvasCtx.oImageSmoothingEnabled = false;

const ctx = scaledCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;

/* Primary field scene */
const FieldScene = sceneProps => {
  /* World creation (can we not have entities just in store, it's a bit confusing) */
  const { createWorld } = WorldManager();
  const { sprites, player, tileEngine } = createWorld(sceneProps);

  let spriteCache = sprites.filter(spr => spr.isAlive());

  // Temporary: Use this to erase storage data
  // NOTE: This brings to light problems with integrity of data and allowing
  // to push the same data (such as quests).
  //store.resetEntityStates();

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
        //interactible.playAnimation("default");
        screenEffectsStateMachine.push(
          curtainState({
            id: "curtain",
            ctx,
            direction: 1,
            onFadeComplete: () => {
              // TODO: This needs testing properly. Events in general do. The fact
              // we bind them at the initializer means this allOff is a problem.
              allOff([
                EV_SCENECHANGE,
                EV_GIVEQUEST,
                EV_UPDATEQUEST,
                EV_UPDATECONVOTRIGGER
              ]);
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
      type: ENTITY_TYPE.NPC,
      reactionEvent: (interactible, actors = []) => {
        const { customProperties } = interactible;

        /* So we 'could' get the data from the sprite but it's too static. Instead
        we should use the lookup table and ask it for what we need. */
        const interactibleProgressData = store
          .getProgressDataStore()
          .find(i => i.entityId === interactible.id);

        if (!Object.keys(customProperties).length) return;

        if (customProperties.triggerConvo) {
          player.onConvoEnter();

          sceneStateMachine.push(
            startConvo({
              startId:
                interactibleProgressData !== undefined
                  ? interactibleProgressData.id
                  : customProperties.triggerConvo,

              onEntry: () =>
                actors.filter(x => x.id !== "player").map(spr => {
                  spr.onConvoEnter();
                  spr.lookAt({
                    x: player.x,
                    y: player.y
                  });
                }),
              onExit: () => actors.map(spr => spr.onConvoExit())
            })
          );
        }
      }
    },
    {
      type: ENTITY_TYPE.PICKUP,
      reactionEvent: (interactible, actors = []) => {
        interactible.ttl = 0;
        store.updatePickupData(interactible);
      }
    },
    {
      type: ENTITY_TYPE.CHEST,
      reactionEvent: (interactible, actors = []) => {
        /*
        TODO: Going to make some adjustments here. So if a quest needs an item, it'll look
        in the inventory rather than rely on being updated via the json data. This just decouples
        it all more.
        */
        if (interactible.isOpen()) return;

        const { customProperties } = interactible;

        if (customProperties && customProperties.containsPickupId) {
          if (interactible.isLocked()) {
            if (
              store
                .getEntityDataStore()
                .find(
                  x => x.customProperties.opensChest === customProperties.id
                )
            ) {
              interactible.unlock();

              sceneStateMachine.push(
                startConvo({
                  startId: "static.chestUnlocked", // TODO: Const this perhaps.
                  onExit: () => {
                    // actors.map(spr => spr.onConvoExit());
                    // const itemToAdd = store
                    //   .getEntityData()
                    //   .find(x => x.id === customProperties.containsPickupId);
                    // store.updatePickupData({
                    //   customProperties,
                    //   id: itemToAdd.id,
                    //   ttl: interactible.ttl,
                    //   type: itemToAdd.type
                    // });
                    // interactible.open();
                    // player.onConvoEnter();
                    // sceneStateMachine.push(
                    //   startConvo({
                    //     startId: "static.itemObtained", // TODO: Const this perhaps.
                    //     stringvars: [itemToAdd.name],
                    //     onExit: () => actors.map(spr => spr.onConvoExit())
                    //   })
                    // );
                  }
                })
              );

              return;
            }

            sceneStateMachine.push(
              startConvo({
                startId: "static.isLocked", // TODO: Const this perhaps.
                onExit: () => actors.map(spr => spr.onConvoExit())
              })
            );

            return;
          }

          const itemToAdd = store
            .getEntityData()
            .find(x => x.id === customProperties.containsPickupId);

          store.updatePickupData({
            customProperties,
            id: itemToAdd.id,
            ttl: interactible.ttl,
            type: itemToAdd.type
          });

          interactible.open();

          player.onConvoEnter();

          sceneStateMachine.push(
            startConvo({
              startId: "static.itemObtained", // TODO: Const this perhaps.
              stringvars: [itemToAdd.name],
              onExit: () => actors.map(spr => spr.onConvoExit())
            })
          );
        }
      }
    }
  ]);

  ////// EVENTS
  on(EV_ITEMOBTAINED, d => {
    const itemToAdd = store.getEntityData().find(x => x.id === d.itemId);

    store.updatePickupData({
      id: itemToAdd.id,
      ttl: itemToAdd.ttl,
      type: itemToAdd.type,
      customProperties: {
        ...d
      }
    });
    
    // Doesn't seem to trigger after previous convo...
    console.log("=========== v");
    sceneStateMachine.push(
      startConvo({
        startId: "static.itemObtained", // TODO: Const this perhaps.
        stringvars: [itemToAdd.name],
        onExit: () => actors.map(spr => spr.onConvoExit())
      })
    );
  });

  // TODO: Can we please not have to pass everything in like this? It's a bit too coupled.
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
      direction: -1
    })
  );

  /* Primary loop */
  return GameLoop({
    update: () => {
      /* Add a flag to sprite to enable/disable collision checks */
      /* Check for anything dead (GC does the rest) */
      spriteCache = spriteCache.filter(spr => spr.isAlive());

      /* Player to useable collision with other entities (not tiles) */
      const playerCollidingWith = sortByDist(
        player,
        circleCollision(
          player,
          spriteCache.filter(s => s.id !== "player" && s.collidesWithPlayer)
        )
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
      /*
      Take your map width and height. Say it's 128x128.
      
      If player is:
      x greater than 36 or x less than map width minus 36
      y greater than 36 or y less than map height minus 36
      */

      //if (tileEngine.mapwidth > resolution.width) {
      tileEngine.sx = player.x - resolution.width / 2;
      //}

      //if (player.y > pad) {
      tileEngine.sy = player.y - resolution.height / 2; //player.y - 120;
      //}
    },
    render: () => {
      /* Instruct tileEngine to update its frame */
      // tileEngine.render();
      tileEngine.renderLayer("rearDecor");
      tileEngine.renderLayer("middleDecor");

      /* Edit z-order based on 'y' then change render order */
      spriteCache
        .sort((a, b) => Math.round(a.y - a.z) - Math.round(b.y - b.z))
        .forEach(sprite => sprite.render());

      /* Update any screen effects that are running */
      screenEffectsStateMachine.update();

      /* Any layers that need to overlap everything go below here */
      tileEngine.renderLayer("forwardDecor");

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
  "assets/tiledata/test3.json",
  "assets/entityimages/little_devil.png",
  "assets/entityimages/little_orc.png",
  "assets/entityimages/little_bob.png",
  "assets/gameData/conversationData.json",
  "assets/gameData/entityData.json",
  "assets/gameData/worldData.json",
  "assets/gameData/questData.json"
).then(assets => {
  // Optional
  console.log("Initialised assets.");
  store.resetEntityStates();

  // Should these be done here? Or further up? Do they need to be unsubbed each scene load?
  /* Not sure if we're doing quest giving in the world manager frankly,
  or even the progress cache. So will move all this later on. */
  /* I'm not 100% sure if an integrity check needs to be done to make sure
  the right convo is loaded. As it technically the data should be fairly pristine.
  Keep an eye on it anyway. */
  on(EV_GIVEQUEST, d => store.addQuestData(d));
  on(EV_UPDATEQUEST, d => store.updateQuestData(d));
  on(EV_UPDATECONVOTRIGGER, d => store.updateProgress(d));
 
  // Init things
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
  sceneManager.loadScene({ areaId: "area1", playerStartId: "area1_entrance" });

  on(EV_SCENECHANGE, props => sceneManager.loadScene({ ...props }));
});
