import createCalDistanceToBezier from './bezier';

function transformCoord(rotation: number, dx: number, dy: number) {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return function transformPoint(x, y) {
    return {
      x: cos * (x - dx) + sin * (y - dy),
      y: -sin * (x - dx) + cos * (y - dy),
    };
  };
}

function calculateRotation(dx: number, dy: number) {
  if (dx === 0) {
    return (-Math.sign(dy) * Math.PI) / 2;
  }
  const rotation = Math.atan(dy / dx);
  if (dx > 0) return rotation;
  return Math.sign(dy) * (Math.PI - Math.abs(rotation));
}

const sorter = (a: number, b: number) => a - b;
function createIsRoughHit(fromX, fromY, cpX, cpY, toX, toY) {
  const transform = transformCoord(
    calculateRotation(toX - fromX, toY - fromY),
    (fromX + toX) / 2,
    (fromY + toY) / 2
  );
  const t_from = transform(fromX, fromY);
  const t_cp = transform(cpX, cpY);
  const t_to = transform(toX, toY);
  const ratio = Math.abs(t_from.x);
  const [bottom, top] = [t_cp.y / 2, 0].sort(sorter);
  let left, right;
  if (t_cp.x >= t_from.x && t_cp.x <= t_to.y) {
    [left, right] = [t_from.x, t_to.x];
  } else if (t_cp.x > 0) {
    [left, right] = [t_from.x, 0.5 * (t_cp.x + (ratio * ratio) / t_cp.x)];
  } else {
    [left, right] = [0.5 * (t_cp.x + (ratio * ratio) / t_cp.x), t_to.x];
  }
  return function isRoughtHit(x: number, y: number, distance: number) {
    const t_point = transform(x, y);
    if (t_point.x < left - distance || t_point.x > right + distance)
      return false;
    if (t_point.y < bottom - distance || t_point.y > top + distance)
      return false;
    return true;
  };
}

function baseMeasureBezier(
  fromX: number,
  fromY: number,
  cpX: number,
  cpY: number,
  toX: number,
  toY: number
) {
  const isRoughHit = createIsRoughHit(fromX, fromY, cpX, cpY, toX, toY);
  const { getDistance, getInfo } = createCalDistanceToBezier(
    fromX,
    fromY,
    cpX,
    cpY,
    toX,
    toY
  );
  function baseIsHit(x: number, y: number, hitDistance: number): boolean {
    // rough hit
    if (!isRoughHit(x, y, hitDistance)) return false;
    //  analyical
    return getDistance(x, y) <= hitDistance;
  }

  function isHit(p: [number, number], hitDistance: number): boolean;
  function isHit(p: { x: number; y: number }, hitDistance: number): boolean;
  function isHit(x: number, y: number, hitDistance: number): boolean;
  function isHit(
    a: number | { x: number; y: number } | [number, number],
    b: number,
    c?: number
  ): boolean {
    if (typeof a === 'number') return baseIsHit(a, b, c as number);
    if (Array.isArray(a)) return baseIsHit(a[0], a[1], b);
    return baseIsHit(a.x, a.y, b);
  }
  return {
    isHit,
    getInfo(
      a: number | { x: number; y: number } | [number, number],
      b?: number
    ): {
      distance: number;
      point: [number, number];
    } {
      if (typeof a === 'number') return getInfo(a, b);
      if (Array.isArray(a)) return getInfo(a[0], a[1]);
      return getInfo(a.x, a.y);
    },
  };
}

function measureBezier(
  fromX: number,
  fromY: number,
  cpX: number,
  cpY: number,
  toX: number,
  toY: number
): ReturnType<typeof baseMeasureBezier>;
function measureBezier(
  from: [number, number],
  cp: typeof from,
  end: typeof from
): ReturnType<typeof baseMeasureBezier>;
function measureBezier(
  from: {
    x: number;
    y: number;
  },
  cp: typeof from,
  end: typeof from
): ReturnType<typeof baseMeasureBezier>;
function measureBezier(
  a: number | [number, number] | { x: number; y: number },
  b: typeof a,
  c: typeof a,
  d?: number,
  e?: number,
  f?: number
): ReturnType<typeof baseMeasureBezier> {
  if (typeof a === 'number') {
    // @ts-ignore
    return baseMeasureBezier(a, b, c, d, e, f);
  }
  if (Array.isArray(a)) {
    return baseMeasureBezier(a[0], a[1], b[0], b[1], c[0], c[1]);
  }
  // @ts-ignore
  return baseMeasureBezier(a.x, a.y, b.x, b.y, c.x, c.y);
}

export default measureBezier;
