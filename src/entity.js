import {
  Sprite,
  imageAssets,
  SpriteSheet
} from "kontra";
import { entityData } from './data';

export default ({
  id,
  assetId,
  x,
  y,
  sheet,
  name,
  controlledByUser = false,
  collidesWithTiles = true
}) => {
  if (!id || !assetId) {
    throw new Error("Entity is fairly useless without an id, you should add one.");
  }

  const { animations, type } = entityData.find(ent => ent.id === assetId);

  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth: 16,
    frameHeight: 16,
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
    controlledByUser
  });
};
