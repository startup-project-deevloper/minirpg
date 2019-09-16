import ConversationIterator from "../conversationIterator";
import { mainFlow } from "../data";

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
