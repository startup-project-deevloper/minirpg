import { Vector } from "kontra";
import { flipSprite } from "../common/spriteFunctions";

export default ({
  id,
  sprite,
  destination,
  onEntry = () => {},
  onExit = () => {}
}) => {
  let isComplete = false;
  let current = Vector(sprite.x, sprite.y);

  return {
    id,
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: () => {
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
        console.log(sprite.name + " reached destination.");
        destination = current;
        isComplete = true;
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
