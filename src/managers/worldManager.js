import { dataAssets, TileEngine, setStoreItem, getStoreItem } from "kontra";
import Entity from "../sprites/entity";

export default (options = { dataKey: "assets/gameData/worldData.json" }) => {
  const { dataKey } = options;
  const worldData = dataAssets[dataKey];

  // TODO: Move these commands out of here and in to some sort of helper layer.
  const entitiesInStore = getStoreItem("entities");
  const getEntityFromStore = id =>
    entitiesInStore ? entitiesInStore.find(e => e.id === id) : null;

  return {
    getAllEntitiesOfType: type => {
      const existingEntities = getStoreItem("entities");
      return existingEntities
        ? existingEntities.filter(ent => ent.type === type)
        : [];
    },
    getAllEntities: () => getStoreItem("entities"),
    getEntityFromStore: id => getEntityFromStore(id),
    resetEntityStates: () => setStoreItem("entities", []),
    savePickup: entityData => {
      const { id, type, ttl } = entityData;
      const existingEntities = getStoreItem("entities");
      const existingEntity = existingEntities
        ? existingEntities.find(x => x.id === id)
        : null;

      /* This needs cleaning up */
      setStoreItem(
        "entities",
        existingEntities
          ? existingEntities
              .filter(ent => ent.id !== id)
              .concat([
                {
                  id,
                  type,
                  ttl,
                  qty: existingEntity ? existingEntity.qty + 1 : 1
                }
              ])
          : [{ id, type, ttl, qty: 1 }]
      );
    },
    createWorld: ({ areaId, playerStartId }) => {
      const { entities, mapKey } = worldData.find(x => x.areaId === areaId);
      const map = dataAssets[mapKey];
      const tileEngine = TileEngine(map);

      const playerStart = entities.find(x => x.id === playerStartId);
      const player = Entity({
        id: "player",
        x: playerStart.x,
        y: playerStart.y,
        collisionMethod: (layer, sprite) =>
          tileEngine.layerCollidesWith(layer, sprite)
      });

      tileEngine.addObject(player);

      return {
        mapKey,
        tileEngine,
        player,
        sprites: entities
          .map(entity => {
            /* Check if item exists in store as it may have been destroyed
            or collected. TODO: Move the pickup check out of here, it's a bit
            confusing alongside other field entity types. */
            const { id } = entity;
            const exists = getEntityFromStore(id);

            const ent =
              !exists || (exists && exists.ttl > 0)
                ? Entity({
                    ...entity,
                    collisionMethod: (layer, sprite) =>
                      tileEngine.layerCollidesWith(layer, sprite)
                  })
                : null;

            /* May wish to add a flag if you want to add it to tilemap or not */
            if (ent) tileEngine.addObject(ent);

            return ent;
          })
          .filter(e => e)
          .concat([player])
      };
    }
  };
};
