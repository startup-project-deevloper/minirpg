import { dataAssets, TileEngine } from "kontra";
import Entity from "../sprites/entity";

export default (options = { dataKey: "assets/gameData/worldData.json" }) => {
  const { dataKey } = options;
  const worldData = dataAssets[dataKey];

  return {
    createWorld: ({ areaId }) => {
      const { entities, mapKey } = worldData.find(x => x.id === areaId);
      const map = dataAssets[mapKey];
      const tileEngine = TileEngine(map);

      return {
        mapKey,
        tileEngine,
        loadedEntities: entities.map(entity =>
          Entity({ ...entity, tileEngine })
        )
      };
    }
  };
};
