import { setStoreItem, dataAssets } from "kontra";
import { emit, EV_CONVONEXT, EV_CONVOSTART, EV_CONVOEND } from "../common/events";
import ConversationIterator from "../common/conversationIterator";

export default (
  options = { dataKey: "assets/gameData/conversationData.json" }
) => {
  const { dataKey } = options;
  const conversationData = dataAssets[dataKey];

  // TODO: Make sure this is working as a singleton pattern
  return ConversationIterator({
    conversationData,
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
};
