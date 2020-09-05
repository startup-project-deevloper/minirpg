import { dataAssets, setStoreItem, getStoreItem } from "kontra";

const Store = () => {
  console.info("Initialized store.");
  const worldDataKey = "assets/gameData/worldData.json";
  const entityDataKey = "assets/gameData/entityData.json";

  /* NOTE: This brings to light problems with integrity of data and allowing to
  push the same data (such as quests).*/
  return {
    resetEntityStates: () => {
      console.log("Entity states were reset.");
      setStoreItem("entities", []);
      setStoreItem("quests", []);
    },
    pushProgress: item => {
      const existing = getStoreItem("progressData");

      if (!existing) {
        setStoreItem("progressData", []);
        return;
      }

      setStoreItem("progressData", [...existing, item]);
    },
    updateProgress: updated => {
      const d = getStoreItem("progressData").map(item => {
        if (item.id === updated.props.entityId) {
          return {
            ...item,
            triggerConvo: updated.props.id
          };
        }
        return item;
      });

      setStoreItem("progressData", d);
    },
    updateQuestData: d => {
      const currentQuests = getStoreItem("quests");

      if (!currentQuests) {
        setStoreItem("quests", []);
        return;
      }

      if (currentQuests.find(x => x.id === d.id)) {
        throw new Error("You should not push the same quest data twice.");
      }

      setStoreItem("quests", [...currentQuests, d]);
    },
    updateEntityData: updatedEntity => {
      const { id, type, ttl } = updatedEntity;
      const existingEntities = getStoreItem("entities");
      const existingEntity = existingEntities
        ? existingEntities.find(x => x.id === id)
        : null;

      /* This needs cleaning up */
      setStoreItem(
        "entities",
        existingEntities
          ? existingEntities.filter(ent => ent.id !== id).concat([
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
    getEntityFromStore: id => {
      const entityDataStore = getStoreItem("entities");
      return entityDataStore && entityDataStore.length
        ? entityDataStore.find(e => e.id === id)
        : null;
    }
  };
};

export default Store();
