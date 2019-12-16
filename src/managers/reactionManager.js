export default (reactions = []) => {
  return {
    get: type => reactions.find(reaction => reaction.type === type)
  };
};
