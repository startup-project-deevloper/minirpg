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

export const dist = (p1, p2) => {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.sqrt(a * a + b * b);
};

export const sortByDist = (target, items = []) =>
  items.sort((a, b) => dist(target, a.position) - dist(target, b.position));

export const circleCollision = (collider, targets, destroyOnHit = false) => {
  if (!collider.radius) {
    console.error("Cannot detect collisions without radius property.");
  }

  const filtered = targets.filter(target => {
    /* Because why would you ever want to collide with yourself? */
    if (collider.id === target.id) return;

    const offsets = target.collisionBodyOptions
      ? {
          x: target.collisionBodyOptions.offsetX
            ? target.x + target.collisionBodyOptions.offsetX
            : target.x,
          y: target.collisionBodyOptions.offsetY
            ? target.y + target.collisionBodyOptions.offsetY
            : target.y
        }
      : {
          x: target.x,
          y: target.y
        };

    let dx = offsets.x - collider.x;
    let dy = offsets.y - collider.y;

    /* You might be seeing results from two perspectives. I'd ensure that it only comes from
    one in the case of a door. */
    //debug(target.name + ": " + Math.sqrt(dx * dx + dy * dy))
    if (Math.sqrt(dx * dx + dy * dy) < target.radius + collider.width) {
      target.ttl = destroyOnHit ? 0 : target.ttl;
      return target;
    }
  });

  return filtered;
};

export const debug = o => {
  console.info(o);
  emit(EV_DEBUGLOG, o);
};
