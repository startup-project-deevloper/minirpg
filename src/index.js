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
import {
  emit,
  on,
  off,
  EV_CONVONEXT,
  EV_CONVOSTART,
  EV_CONVOEND,
  EV_SCENECHANGE,
  EV_CONVOCHOICE
} from "./events";
import { circleCollision } from "./helpers";
import { mainFlow, ENTITY_TYPE, worldData } from "./data";
import fieldState from "./states/fieldState";
import curtainState from "./states/curtainState";

const { canvas } = init();

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
ctx.scale(3, 3);

const Scene = ({ areaId, onError = () => {} }) => {
  if (!areaId) {
    /* Use error code const */
    onError(0);
    return;
  }

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
          // This needs plugging in
          currentActors: sprites
        });
      }
    });
  };

  const createCurtainState = ({ ctx, direction, onFadeComplete }) => {
    return curtainState({
      id: "curtain",
      ctx,
      direction,
      onFadeComplete
    });
  };

  const createWorld = ({ areaId, worldData }) => {
    const { entities, mapKey } = worldData.find(x => x.id === areaId);

    return {
      mapKey,
      loadedEntities: entities.map(entity => Entity({ ...entity }))
    };
  };

  const { loadedEntities, mapKey } = createWorld({ areaId, worldData });
  const map = dataAssets[mapKey];
  const tileEngine = TileEngine(map);

  /* All but the player are generated here */
  const player = Entity({
    x: 0,
    y: 0,
    name: "Player",
    id: "player",
    assetId: "player",
    controlledByUser: true
  });

  /* TODO: make immutable */
  let sprites = [player, ...loadedEntities];

  const sceneStateMachine = StateMachine();
  const screenEffectsStateMachine = StateMachine();

  sceneStateMachine.push(
    createFieldState({
      sprites,
      canvas,
      tileEngine
    })
  );

  screenEffectsStateMachine.push(
    createCurtainState({
      ctx,
      direction: 1
    })
  );

  // Experimental
  const reactionRegister = {
    [ENTITY_TYPE.DOOR]: (firstAvailable, sprites) => {
      firstAvailable.playAnimation("open");

      screenEffectsStateMachine.push(
        createCurtainState({
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
    convoIterator.goToExact(choice.to, {
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

/* Make sure to embed your tilesets or it'll run in to problems */
load(
  "assets/tileimages/test.png",
  "assets/tiledata/test.json",
  "assets/entityimages/little_devil.png",
  "assets/entityimages/little_orc.png"
).then(assets => {
  const handleOnErrored = code => {
    if (code === 0) {
      throw new Error("Critical: Cannot load an area without an id!");
    }
  };

  const loadScene = props => {
    /* TODO: Don't forget to unbind everything! */
    console.info("==> Next Scene:", props);

    // Curtain effects here (perhaps just use css?)
    Scene({
      ...props,
      onError: c => {
        off(EV_SCENECHANGE, loadScene);
        handleOnErrored(c);
      }
    }).start();
  };

  on(EV_SCENECHANGE, loadScene);

  initKeys();

  UI({
    onConversationChoice: choice => emit(EV_CONVOCHOICE, choice)
  }).start();

  loadScene({ areaId: "area1" });
});
