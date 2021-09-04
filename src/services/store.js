import { dataAssets, setStoreItem, getStoreItem } from "kontra";
import { emit, EV_ITEMOBTAINED } from "../common/events";

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
        x => x.entityId === updated.entityId
      );

      if (!entryExists) {
        setStoreItem("progressData", [...progressData, updated]);
        return;
      }

      setStoreItem(
        "progressData",
        progressData.map(item => {
          if (item.entityId === updated.entityId) {
            return {
              ...updated
            };
          }
          return item;
        })
      );
    },
    addQuestData: d => {
      const currentQuests = getStoreItem("quests");
      const existingQuest = currentQuests.find(x => x.id === d.id) || null;


      if (!currentQuests) {
        setStoreItem("quests", [d]);
        return;
      }

      if (existingQuest) {
        throw new Error("You should not push the same quest twice.");
      }

      setStoreItem("quests", [...currentQuests, d]);
    },
    updateQuestData: d => {
      const currentQuests = getStoreItem("quests");
      const existingQuest = currentQuests.find(x => x.id === d.id) || null;

      if (!currentQuests) {
        throw new Error("Tried pushing quest to non-existent data.");
      }

      if (existingQuest && existingQuest.questIndex === d.questIndex) {
        throw new Error(
          "You should not push the same quest or part data twice."
        );
      }

      if (existingQuest) {
        setStoreItem("quests", [
          ...currentQuests.filter(x => x.id !== existingQuest.id),
          {
            ...existingQuest,
            questIndex: d.questIndex
          }
        ]);
      } else {
        throw new Error("Nothing was updated.");
      }
    },
    updatePickupData: updatedEntity => {
      const existing = getStoreItem("entities") || [];
      const { customProperties, id, type, ttl } = updatedEntity;

      setStoreItem("entities", [
        ...existing,
        { worldId: customProperties.worldId, id, type, ttl }
      ]);

      console.log("Pickups updated:", getStoreItem("entities"));

      // Causes major issues if you're listening elsewhere too.
      //emit(EV_ITEMOBTAINED, updatedEntity);
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
      return entityDataStore && entityDataStore.length
        ? entityDataStore.find(e => e[customQuery] === id)
        : null;
    }
  };
};

export default Store();
