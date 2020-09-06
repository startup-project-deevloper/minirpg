import { dataAssets, setStoreItem, getStoreItem } from "kontra";

const Store = () => {
  console.info("Initialized store.");
  const worldDataKey = "assets/gameData/worldData.json";
  const entityDataKey = "assets/gameData/entityData.json";

  /* NOTE: This brings to light problems with integrity of data and allowing to
  push the same data (such as quests). Keep an eye on it. */
  return {
    resetEntityStates: () => {
      console.log("Entity states were reset.");
      setStoreItem("entities", []);
      setStoreItem("quests", []);
      setStoreItem("progressData", []);
    },
    pushProgress: item => {
      const existing = getStoreItem("progressData");

      if (!existing) {
        setStoreItem("progressData", [item]);
        return;
      }

      setStoreItem("progressData", [...existing, item]);
    },
    updateProgress: updated => {
      // TODO: This all might break down if NPC is in multiple places, be careful.
      const progressData = getStoreItem("progressData");
      const entryExists = progressData.some(
        x => x.props.entityId === updated.props.entityId
      );

      console.log("============>");
      console.log(progressData, updated, entryExists);

      if (!entryExists) {
        setStoreItem("progressData", [...progressData, updated]);
        return;
      }

      setStoreItem(
        "progressData",
        progressData.map(item => {
          if (item.props.entityId === updated.props.entityId) {
            return {
              ...updated
            };
          }
          return item;
        })
      );
    },
    updateQuestData: d => {
      const currentQuests = getStoreItem("quests");

      if (!currentQuests) {
        setStoreItem("quests", [d]);
        return;
      }

      if (currentQuests.find(x => x.id === d.id)) {
        throw new Error("You should not push the same quest data twice.");
      }

      setStoreItem("quests", [...currentQuests, d]);
    },
    updatePickupData: updatedEntity => {
      const { customProperties, id, type, ttl } = updatedEntity;
      setStoreItem("entities", [
        ...getStoreItem("entities"),
        { worldId: customProperties.worldId, id, type, ttl }
      ]);
    },
    getMapData: mapKey => dataAssets[mapKey],
    getWorldData: () => dataAssets[worldDataKey],
    getEntityData: () => dataAssets[entityDataKey],
    getProgressDataStore: () => getStoreItem("progressData"),
    getEntityDataStore: () => getStoreItem("entities"),
    getQuestDataStore: () => {},
    getAllEntitiesOfType: type => {
      const entityDataStore = getStoreItem("entities");
      return entityDataStore
        ? entityDataStore.filter(ent => ent.type === type)
        : [];
    },
    getEntityFromStore: (id, customQuery = "id") => {
      const entityDataStore = getStoreItem("entities");
      console.log(entityDataStore);
      return entityDataStore && entityDataStore.length
        ? entityDataStore.find(e => e[customQuery] === id)
        : null;
    }
  };
};

export default Store();
