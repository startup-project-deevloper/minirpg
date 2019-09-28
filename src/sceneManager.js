export default ({ sceneObject: Scene }) => {
  let currentScene = null;

  return {
    loadScene: props => {
      if (currentScene) currentScene.stop();

      currentScene = Scene(props);
      currentScene.start();
    }
  };
};
