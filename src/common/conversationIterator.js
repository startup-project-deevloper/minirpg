export default ({
  conversationData,
  onChatStarted = (node, props) => {},
  onChatNext = (node, props) => {},
  onChatComplete = lastPositionSaved => {},
  onChainProgress = lastNodeId => {},
  onChatCancelled = () => {}
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
      ? conversationData.filter((node, index) => {
          return query === node.id
            ? {
                node,
                index
              }
            : null;
        })[0]
      : null;

    return displayNode(queriedNode);
  };

  const start = (query, props = {}) => {
    const queriedNode = queryNode(query);

    isRunning = true;
    isComplete = false;

    onChatStarted(queriedNode, props);

    return displayNode(queriedNode);
  };

  const goToExact = (query, props = {}) => {
    const queriedNode = queryNode(query);

    onChatNext(queriedNode, props);

    return displayNode(queriedNode);
  };

  const goToNext = (props = {}) => {
    // We need to run this 'after' the finish so it avoids chained exec on exit.
    if (!isRunning) return;

    if (isComplete) {
      isRunning = false;
      return;
    }

    // TODO: Beware, if you're not checking for existent choices, this will error out,
    // or do something a little funky. May want to check for choices here instead?
    const { id, to, choices, actions } = currentNode;

    // Wait if choices are presented.
    if (choices.length) return;

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

      isComplete = true;
      onChatComplete(id);
      console.log("End reached, close the convo.");
      return;
    }

    return goToExact(to, props);
  };

  return {
    isComplete: () => isComplete,
    currentIndex: () => index,
    start,
    goToExact,
    goToNext
  };
};
