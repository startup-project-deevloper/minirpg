import { Sprite, imageAssets, SpriteSheet } from "kontra";
import { entityData } from "./data";

export default ({
  id,
  assetId,
  x,
  y,
  name,
  controlledByUser = false,
  collidesWithTiles = true
}) => {
  if (!id || !assetId) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

  const {
    animations,
    type,
    frameWidth,
    frameHeight,
    sheet,
    manualAnimation = false
  } = entityData.find(ent => ent.id === assetId);

  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });

  return Sprite({
    type,
    id,
    name,
    x,
    y,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    manualAnimation
  });
};
