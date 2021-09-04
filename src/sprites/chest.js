import { uniqueId } from "../common/helpers";
import { Sprite, imageAssets, SpriteSheet } from "kontra";

export default ({
  id,
  x,
  y,
  z = 1,
  customProperties = {},
  entityData = null,
  collisionMethod = (layer, sprite) => {}
}) => {
  if (!id) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

  const {
    name,
    type,
    animations,
    frameWidth,
    frameHeight,
    sheet,
    collisionBodyOptions = null,
    manualAnimation = false,
    controlledByUser = false,
    collidesWithTiles = true,
    collidesWithPlayer = true
  } = entityData;

  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });

  let opened = false;
  let isLocked = customProperties.startsLocked || false;

  /* Id should really be named 'class' since its re-used. */
  const sprite = Sprite({
    instId: uniqueId(id),
    id,
    type,
    name,
    x,
    y,
    z,
    anchor: { x: 0.5, y: 0.5 },
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    collisionBodyOptions,
    collidesWithPlayer,
    manualAnimation,
    isOpen: () => opened,
    isLocked: () => isLocked,
    unlock: () => (isLocked = false),
    open: () => {
      if (opened || isLocked) return;

      sprite.playAnimation("open");
      opened = true;
    },
    onAttacked: () => {
      // Push an internal state for damage effect (whatever that's going to be)
      console.log(id);
    },
    onConvoEnter: () => {},
    onConvoExit: () => {},
    update: () => {
      // Static entities may still have anims so add them in later.
      // Anim code...
      // Call this to ensure animations are player
      sprite.advance();
    }
  });

  return sprite;
};
