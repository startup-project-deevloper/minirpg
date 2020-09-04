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
        walkableTiles.push(Vector(i, j));
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

      for (let i = 0; i < calculatedPath.length; i++) {
        destQueue.enqueue(
          Vector(calculatedPath[i].x * 16, calculatedPath[i].y * 16)
        );
      }

      tileDest = destQueue.dequeue();
      destination = Vector(tileDest.x, tileDest.y);

      console.log("First point to go to:");
      console.log(destQueue.elements());

      onEntry();
    },
    update: () => {
      if (!destination) return;

      // Note: No need for acc at this stage
      let vel = Vector(0, 0);

      // Current vector towards target
      let distanceToTarget = destination.subtract(current).length();

      // Cease all movement if arrived, otherwise just carry on
      if (distanceToTarget > 10) {
        vel = destination.subtract(current).normalize().scale(0.5);

        sprite.x += vel.x;
        sprite.y += vel.y;

        current = Vector(sprite.x, sprite.y);
      } else {
        console.log(sprite.name + " reached path segment.");
        destination = !destQueue.isEmpty() ? destQueue.dequeue() : current;
        isComplete = destQueue.isEmpty();
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
