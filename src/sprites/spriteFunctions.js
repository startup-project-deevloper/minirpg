import { getNormal } from "../common/helpers";

export const moveSprite = ({
  dir,
  sprite,
  checkCollision = () => {
    return false;
  }
}) => {
  /* Normalise so you don't go super fast diagonally */
  const directionNormal = getNormal(dir);

  /// For collisions with tiles
  let oldPos = {
    x: sprite.x,
    y: sprite.y
  };

  // Move X then check X (careful editing directly, might lead to issues with camera)
  sprite.x += directionNormal.x;

  // Collider check (const layer names please)
  const collidedWithX = checkCollision(sprite);

  if (sprite.collidesWithTiles && collidedWithX) {
    sprite.x = oldPos.x;
    sprite.y = oldPos.y;
  }

  // Update old pos ref
  oldPos = {
    x: sprite.x,
    y: sprite.y
  };

  // Move Y then check Y (careful editing directly, might lead to issues with camera)
  sprite.y += directionNormal.y;

  // Collider check against tiles
  const collidedWithY = checkCollision(sprite);

  if (sprite.collidesWithTiles && collidedWithY) {
    sprite.x = oldPos.x;
    sprite.y = oldPos.y;
  }

  return {
    directionNormal
  };
};

export const flipSprite = ({ direction, sprite }) => {
  if (direction.x < 0) {
    sprite.width = -sprite.width;
  } else if (direction.x > 0) {
    sprite.width = sprite.width;
  }
};
