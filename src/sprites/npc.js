import { flipSprite } from "../common/spriteFunctions";
import { uniqueId } from "../common/helpers";
import { Sprite, imageAssets, SpriteSheet } from "kontra";
import aiLoader from "../ai/aiLoader";

export default ({
  id,
  x,
  y,
  z = 1,
  customProperties = {},
  entityData = null,
  aiPathGrid = null,
  collisionMethod = (layer, sprite) => {}
}) => {
  if (!id) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

  const {
    aiScript,
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

  const ai = aiLoader(aiScript);

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
    onConvoEnter: () => ai.onConvoEnter(),
    onConvoExit: () => ai.onConvoExit(),
    lookAt: ({ x, y }) => {
      flipSprite({
        direction: {
          x: sprite.x > x ? -1 : 1,
          y: sprite.y > y ? -1 : 1
        },
        sprite
      });
    },
    update: () => ai.update()
  });

  ai.bootstrap({ sprite, aiPathGrid });
  ai.start();

  return sprite;
};
