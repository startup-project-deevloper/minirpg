import {
  Sprite,
  imageAssets,
  dataAssets,
  SpriteSheet,
  keyPressed
} from "kontra";
import { moveSprite, flipSprite } from "./spriteFunctions";

export default ({
  id,
  assetId,
  x,
  y,
  z = 1,
  name,
  tileEngine,
  movementDisabled = false,
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

  const sprite = Sprite({
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
    manualAnimation,
    movementDisabled,
    update: () => {
      const dir = controlledByUser
        ? {
            x: keyPressed("a") ? -1 : keyPressed("d") ? 1 : 0,
            y: keyPressed("w") ? -1 : keyPressed("s") ? 1 : 0
          }
        : { x: 0, y: 0 }; // AI (to add later)

      const { directionNormal } = moveSprite({
        dir: sprite.movementDisabled ? { x: 0, y: 0 } : dir,
        sprite,
        checkCollision: sprite =>
          tileEngine.layerCollidesWith("Collision", sprite)
      });

      // Flip the sprite on movement
      flipSprite({ direction: directionNormal, sprite });

      // Do some animations
      const isMoving = directionNormal.x !== 0 || directionNormal.y !== 0;
      if (!sprite.manualAnimation) {
        sprite.playAnimation(isMoving ? "walk" : "idle");
      }

      // Call this to ensure animations are player
      sprite.advance();
    }
  });

  return sprite;
};
