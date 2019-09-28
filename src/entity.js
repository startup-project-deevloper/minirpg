import { Sprite, imageAssets, dataAssets, SpriteSheet } from "kontra";

export default ({
  id,
  assetId,
  x,
  y,
  z = 1,
  name,
  controlledByUser = false,
  collidesWithTiles = true,
  customProperties = {},
  dataKey = "assets/gameData/entityData.json"
}) => {
  if (!id || !assetId) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

  const entityData = dataAssets[dataKey];

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
    z,
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    manualAnimation
  });
};
