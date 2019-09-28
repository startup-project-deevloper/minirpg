import { init, GameLoop, load } from "kontra";
import SceneManager from "./sceneManager";

const { canvas } = init();

const Scene = ({ areaId }) => {
  console.info("==> Next Scene Loaded:", areaId);

  return GameLoop({
    update: () => console.log("Area Id:", areaId),
    render: () => {}
  });
};

load("assets/tileimages/test.png").then(assets => {
  const sceneManager = SceneManager({
    scenes: [
      {
        areaId: "area1",
        sceneObject: Scene
      },
      {
        areaId: "area2",
        sceneObject: Scene
      }
    ]
  });

  sceneManager.loadScene({
    areaId: "area1"
  });

  setTimeout(() => {
    sceneManager.loadScene({
      areaId: "area2"
    });
  }, 3000);
});
