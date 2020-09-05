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
    const { id, to, choices, actions } = currentNode;

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

      if (actions.some(action => action.includes("changeStartIdTo"))) {
        const strs = actions.filter(str => str.includes("changeStartIdTo"));
        strs.forEach(str => {
          const splitToId = str.split(".");
          console.log(splitToId[splitToId.length - 1]);
          // How the hell do I get this changed back on Daryl...
          // is it worth making some sort of table instead?
          // Might be worth using events actually...
          // broadcast out to update certain parameters
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
