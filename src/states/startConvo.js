import ConversationIterator from "../conversationIterator";
import { mainFlow } from "../data";
import { emit, ES_CONVOSTART } from "../events";

export default ({ id, cache, onEntry = () => {}, onExit = () => {} }) => {
  let isComplete = false;

  return {
    id,
    isComplete,
    enter: props => {
      console.log("Player entered a conversational state:");
      console.log(props);

      const convoIterator = ConversationIterator({
        collection: mainFlow,
        onChatComplete: lastPositionSaved => {
          console.log("Exited:", lastPositionSaved);
        },
        onChainProgress: lastNodeId => {
          cache.set("progress", {
            storyProgress: lastNodeId
          });
        }
      });

      // Example starter convo
      const val = convoIterator.goToExact("m1");
      console.log(val);

      emit(ES_CONVOSTART, { ...props, val });

      onEntry(props);
    },
    update: () => {
      //...
    },
    exit: () => {
      onExit();
    }
  };
};
