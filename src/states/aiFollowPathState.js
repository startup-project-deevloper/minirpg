import { Vector } from "kontra";
import { Queue } from "../common/helpers";
import { flipSprite } from "../common/spriteFunctions";
import { getRandomIntInclusive } from "../common/helpers";
import { findPath } from "../common/aiHelpers";

export default ({ props, onEntry = () => {}, onExit = () => {} }) => {
  const destQueue = Queue();
  const { aiPathGrid, sprite } = props;

  // TODO: Stick in a config (you may have one than one in future also).
  const walkableId = 102;
  const tx = Math.floor(sprite.x / 16);
  const ty = Math.floor(sprite.y / 16);
  let walkableTiles = [];

  // We need to grab a random point on the aiPathGrid but only if it's walkable.
  for (let i = 0; i < aiPathGrid.length; i++) {
    for (let j = 0; j < aiPathGrid[i].length; j++) {
      if (aiPathGrid[i][j] === walkableId) {
        walkableTiles.push(Vector(j, i));
      }
    }
  }

  if (!walkableTiles.length) {
    throw "No walkable tiles were found."; // TODO: const errors please
  }

  const randomWalkable =
    walkableTiles[getRandomIntInclusive(0, walkableTiles.length - 1)];

  let rx = randomWalkable.x;
  let ry = randomWalkable.y;
  let isComplete = false;
  let current = Vector(sprite.x, sprite.y);
  let tileDest = null;
  let destination = null;

  return {
    id: "followPath",
    isComplete: () => isComplete,
    enter: async props => {
      // TODO: This isn't a hugely performant method. ES should be running at all times
      // and instantiate only once.
      const calculatedPath = await findPath({
        aiPathGrid,
        tx,
        ty,
        rx,
        ry,
        walkableId
      });

      // Exit early on errored path (could be a sign of something sinister)
      if (!calculatedPath.length) {
        isComplete = true;
        return;
      }

      // Let set to '1' to avoid pointless backtrack on first segment
      // Give the destination a little variation as well to make it more natural
      for (let i = 1; i < calculatedPath.length; i++) {
        destQueue.enqueue(
          Vector(
            calculatedPath[i].x * 16 + getRandomIntInclusive(0, 16),
            calculatedPath[i].y * 16 + getRandomIntInclusive(0, 16)
          )
        );
      }

      tileDest = destQueue.dequeue();
      destination = Vector(tileDest.x, tileDest.y);

      onEntry();
    },
    update: () => {
      if (!destination) {
        isComplete = true;
        return;
      }

      // Note: No need for acc at this stage
      let vel = Vector(0, 0);

      // Current vector towards target
      let distanceToTarget = destination.subtract(current).length();

      // Cease all movement if arrived, otherwise just carry on
      if (distanceToTarget > 1) {
        vel = destination.subtract(current).normalize().scale(0.75);
        sprite.x += vel.x;
        sprite.y += vel.y;
        current = Vector(sprite.x, sprite.y);
      } else {
        destination = destQueue.dequeue();
      }

      flipSprite({ direction: vel, sprite });

      // Do some animations
      const isMoving = vel.x !== 0 || vel.y !== 0;

      if (!sprite.manualAnimation) {
        sprite.playAnimation(isMoving ? "walk" : "idle");
      }

      // Call this to ensure animations are player
      sprite.advance();
    },
    exit: () => onExit()
  };
};
