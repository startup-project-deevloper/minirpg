import { init, GameLoop, load } from "kontra";

const { canvas } = init();

const Scene = ({ areaId }) => {
  return GameLoop({
    update: () => console.log("Area Id:", areaId),
    render: () => {}
  });
};

load("assets/tileimages/test.png").then(assets => {
  const loadScene = props => {
    console.info("==> Next Scene:", props);

    return Scene({
      ...props
    }).start();
  };

  loadScene({ areaId: "area1" });

  setTimeout(() => {
    loadScene({ areaId: "area2" });
  }, 3000);
});
