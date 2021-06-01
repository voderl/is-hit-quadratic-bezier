import measureBezier from '../src';

describe('blah', () => {
  it('works different type', () => {
    expect(() => {
      measureBezier(0, 0, 0.5, 1, 1, 0);
      measureBezier({ x: 0, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 });
      measureBezier([0, 0], [0.5, 1], [1, 0]);
    }).not.toThrowError();
  });
  it('works different type', () => {
    measureBezier(0, 0, 0.5, -1, -1, 0);
    measureBezier({ x: 0, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 });
    measureBezier([0, 0], [0.5, 1], [1, 0]);
  });
  const { getInfo, isHit } = measureBezier(0, 0, 0.5, 1, 1, 0);
  it('works', () => {
    expect(
      getInfo({
        x: 0.5,
        y: 0.5,
      }).distance
    ).toEqual(0);
    expect(isHit(0.5, 0.5, 0)).toEqual(true);
    expect(isHit(100, 100, 10)).toEqual(false);
    expect(isHit(100, 100, 150)).toEqual(true);
    expect(
      getInfo({
        x: 0.5,
        y: 1,
      }).distance
    ).toEqual(0.5);
    expect(
      getInfo({
        x: 0.5,
        y: -5,
      }).distance
    ).toEqual(Math.sqrt(0.5 * 0.5 + 5 * 5));
  });
});
