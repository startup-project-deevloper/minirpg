import { emit, EV_DEBUGLOG } from "../common/events";

export const uniqueId = (pre = "") =>
  `${pre}${pre.length ? "_" : ""}` +
  (Number(String(Math.random()).slice(2)) +
    Date.now() +
    Math.round(performance.now())).toString(36);

export const between = (v, a, b) => v > a && v < b;

export const vmulti = (vec, v) => {
  let x = 0;
  let y = 0;
  if (typeof v === "object") {
    x = vec.x * v.x;
    y = vec.y * v.y;
  } else {
    x = vec.x * v;
    y = vec.y * v;
  }
  return Vector(x, y);
};

export const circleCollision = (collider, targets, destroyOnHit = false) => {
  if (!collider.radius) {
    console.error("Cannot detect collisions without radius property.");
  }

  return targets.filter(target => {
    let dx = target.x - collider.x;
    let dy = target.y - collider.y;
    if (Math.sqrt(dx * dx + dy * dy) < target.radius + collider.width) {
      target.ttl = destroyOnHit ? 0 : target.ttl;
      return target;
    }
  });
};

export const debug = o => {
  console.info(o);
  emit(EV_DEBUGLOG, o);
};
