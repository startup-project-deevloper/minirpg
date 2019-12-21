import { dataAssets, TileEngine, setStoreItem, getStoreItem } from "kontra";
import Entity from "../sprites/entity";

export default (options = { dataKey: "assets/gameData/worldData.json" }) => {
  const { dataKey } = options;
  const worldData = dataAssets[dataKey];

  const entitiesInStore = getStoreItem("entities");
  const getEntityFromStore = id =>
    entitiesInStore ? entitiesInStore.find(e => e.id === id) : null;

  return {
    getAllEntitiesOfType: type => {
      const existingEntities = getStoreItem("entities");
      return existingEntities ? existingEntities.filter(ent => ent.type === type) : [];
    },
    getAllEntities: () => getStoreItem("entities"),
    getEntityFromStore: id => getEntityFromStore(id),
    resetEntityStates: () => setStoreItem("entities", []),
    saveEntityState: entityData => {
      const { id, assetId, type, ttl } = entityData;
      const existingEntities = getStoreItem("entities");

      setStoreItem(
        "entities",
        existingEntities
          ? existingEntities.filter(ent => ent.id !== id).concat([{ id, type, ttl }])
          : [{ id, assetId, type, ttl }]
      );
    },
    createWorld: ({ areaId }) => {
      const { entities, mapKey } = worldData.find(x => x.id === areaId);
      const map = dataAssets[mapKey];
      const tileEngine = TileEngine(map);

      return {
        mapKey,
        tileEngine,
        loadedEntities: entities
          .map(entity => {
            const { id } = entity;
            const exists = getEntityFromStore(id);

            return !exists || (exists && exists.ttl > 0)
              ? Entity({ ...entity, tileEngine })
              : null;
          })
          .filter(e => e)
      };
    }
  };
};
