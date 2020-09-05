// TODO: Ensure you're definitely calling allOff and no events are hanging on
// at load or scene change.
import { allOff, on, emit, EV_UPDATECONVOTRIGGER, EV_GIVEQUEST } from "./events";

export const MODES = {
  NOTRUNNING: 100,
  NEXTNODE: 200,
  AWAITINGINPUT: 300,
  JUSTFINISHED: 400,
  COMPLETED: 500
}

export default ({
  conversationData,
  onChatStarted = (node, props) => { },
  onChatNext = (node, props) => { },
  onChatComplete = lastPositionSaved => { },
  onChainProgress = lastNodeId => { },
  onChatCancelled = () => { }
}) => {
  let index = 0;
  let currentNode = conversationData[index];
  let isRunning = false;
  let isComplete = false;

  const displayNode = queriedNode => {
    if (queriedNode) {
      currentNode = queriedNode;
      index = queriedNode.index;
      return queriedNode;
    } else {
      throw "No node match.";
    }
  };

  const queryNode = query => {
    const queriedNode = conversationData.length
      ? conversationData.filter(node => query === node.id)[0]
      : null;

    return displayNode(queriedNode);
  };

  const start = (query, props = {}) => {
    const queriedNode = queryNode(query);

    isRunning = true;
    isComplete = false;

    onChatStarted(queriedNode, props);

    return {
      ...displayNode(queriedNode),
      mode: MODES.NEXTNODE
    };
  };

  const goToExact = (query, props = {}) => {
    const queriedNode = queryNode(query);

    onChatNext(queriedNode, props);

    return {
      ...displayNode(queriedNode),
      mode: MODES.NEXTNODE
    };
  };

  const goToNext = (props = {}) => {
    // We need to run this 'after' the finish so it avoids chained exec on exit.
    if (!isRunning) return {
      mode: MODES.NOTRUNNING
    };

    if (isComplete) {
      isRunning = false;
      return {
        mode: MODES.COMPLETED
      };
    }

    // TODO: Beware, if you're not checking for existent choices, this will error out,
    // or do something a little funky. May want to check for choices here instead?
    const { id, to, choices, actions, dataActions } = currentNode;

    // Wait if choices are presented.
    if (choices.length) return {
      ...currentNode,
      mode: MODES.AWAITINGINPUT
    }

    // TODO: Consts please.
    if (
      actions.some(action => action === "endConversation") ||
      (choices.length === 0 && !to)
    ) {
      if (actions.some(action => action === "save")) {
        onChainProgress(id);
      }

      if (actions.some(action => action === "cancel")) {
        onChatCancelled();
      }

      if (dataActions && dataActions.length) {
        dataActions.forEach(d => {
          // TODO: Might be best to use a 'type' rather than id
          switch(d.id) {
            case "giveQuest":
              emit(EV_GIVEQUEST, d);
              break;
            case "updateConvoTrigger":
              emit(EV_UPDATECONVOTRIGGER, d);
              break;
          }
        })
      }

      isComplete = true;
      onChatComplete(id);
      console.log("End reached, close the convo.");
      return {
        ...currentNode,
        mode: MODES.JUSTFINISHED
      }
    }

    return {
      ...goToExact(to, props),
      mode: MODES.NEXTNODE
    };
  };

  return {
    isComplete: () => isComplete,
    isRunning: () => isRunning,
    currentIndex: () => index,
    start,
    goToExact,
    goToNext
  };
};
