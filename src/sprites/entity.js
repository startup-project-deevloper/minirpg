import { moveSprite, flipSprite } from "./spriteFunctions";
import {
  Sprite,
  dataAssets,
  imageAssets,
  SpriteSheet,
  keyPressed
} from "kontra";

export default ({
  id,
  x,
  y,
  z = 1,
  customProperties = {},
  collisionMethod = (layer, sprite) => { }
}) => {
  if (!id) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

  const dataKey = "assets/gameData/entityData.json";
  const entityData = dataAssets[dataKey];

  const {
    name,
    type,
    animations,
    frameWidth,
    frameHeight,
    sheet,
    collisionBodyOptions = null,
    manualAnimation = false,
    movementDisabled = false,
    controlledByUser = false,
    collidesWithTiles = true
  } = entityData.find(ent => ent.id === id);

  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });

  const sprite = Sprite({
    id,
    type,
    name,
    x,
    y,
    z,
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    collisionBodyOptions,
    manualAnimation,
    movementDisabled,
    update: () => {
      /* Attacking */
      if (keyPressed("q")) {
        /*
        For attacking, going full throttle with a turn-based system is quite a lot
        to handle. For now it'd be easier to settle for arcade sort of attacks and
        being clever with patterns / interaction such as seen on Zelda.

        So that said, what general idea is this:
        - Hitbox appears, probably with an animation in sync with it
        - Collision picked up when hitbox hits whatever the thing is
        - The thing that's hit get informed of the hit, and as to what actually
        hit it. If the thing is hostile (no friendly-fire), we search for the item in
        question and run against its stats.
        - It's a lot to calculate on the hit, but it has to be done at some point. After
        that the damage animation plays on the target, and so on. Let the entity handle
        what happens to it under circumstances such as if it's locked in animation, etc.
        - The attacker can just worry about its self and what it's doing with attack and
        animations.
        */
      }

      /* Movement */
      const dir = controlledByUser
        ? {
          x: keyPressed("a") ? -1 : keyPressed("d") ? 1 : 0,
          y: keyPressed("w") ? -1 : keyPressed("s") ? 1 : 0
        }
        : { x: 0, y: 0 }; // AI (to add later)

      const { directionNormal } = moveSprite({
        dir: sprite.movementDisabled ? { x: 0, y: 0 } : dir,
        sprite,
        checkCollision: sprite => collisionMethod("Collision", sprite)
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

  // console.log("=> Sprite generated:", sprite.name, sprite.id);
  // console.log(sprite);

  return sprite;
};
