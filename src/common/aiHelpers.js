import EasyStar from "easystarjs";

export const findPath = ({ aiPathGrid, tx, ty, rx, ry, walkableId }) => {
  return new Promise(resolve => {
    // TODO: Not sure you'll want to do this every single time, seems intensive.
    const easystar = new EasyStar.js();

    easystar.enableDiagonals();
    easystar.enableCornerCutting();
    easystar.setGrid(aiPathGrid);
    easystar.setAcceptableTiles([walkableId]);

    easystar.findPath(tx, ty, rx, ry, function(path) {
      if (path === null || path !== null && path.length === 0) {
        console.log("Path was not found.");

        resolve([]);
      } else {
        console.log(
          "Path was found. The first Point is " + path[0].x + " " + path[0].y
        );

        resolve(path);
      }
    });

    // Just calculate once (if you run in to issues, may need to do it every frame. Def so for a changing map landscape)
    easystar.calculate();
  });
};

export const wait = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
