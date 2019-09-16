import {
  init,
  GameLoop,
  Sprite,
  load,
  TileEngine,
  dataAssets,
  imageAssets,
  keyPressed,
  initKeys,
  SpriteSheet
} from "kontra";

import { uniqueId } from "./helpers";

export default ({
  id = uniqueId("ent_"),
  x,
  y,
  sheet,
  name,
  controlledByUser = false,
  collidesWithTiles = true
}) => {
  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth: 16,
    frameHeight: 16,
    animations: {
      idle: {
        frames: [0, 1, 2, 3],
        frameRate: 8
      },
      walk: {
        frames: [3, 4, 5, 6, 7],
        frameRate: 16
      }
    }
  });

  return Sprite({
    id,
    name,
    x,
    y,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser
  });
};
