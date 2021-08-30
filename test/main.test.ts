import measureBezier from '../src';

describe('main', () => {
  it('works different type', () => {
    expect(() => {
      measureBezier(0, 0, 0.5, 1, 1, 0);
      measureBezier({ x: 0, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 });
      measureBezier([0, 0], [0.5, 1], [1, 0]);
    }).not.toThrowError();
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

  it('edge case: line', () => {
    let getInfo, isHit;
    expect(() => {
      const data = measureBezier(0, 0, 0.5, 0.5, 1, 1);
      getInfo = data.getInfo;
      isHit = data.isHit;
      isHit(2, 2, 1);
      getInfo(2, 2);
    }).not.toThrow();
    expect(isHit(2, 2, 1)).toEqual(false);
    expect(getInfo(2, 2).distance).toEqual(Math.SQRT2);
    expect(isHit(2, 2, 2)).toEqual(true);
    for (let i = 0; i <= 10; i++) {
      const v = Math.random();
      expect(getInfo(v, v)).toEqual({
        distance: 0,
        point: [v, v],
      });
      expect(getInfo(v + 1, v + 1)).toEqual({
        distance: Math.sqrt(2 * v * v),
        point: [1, 1],
      });
      expect(getInfo(-v, -v)).toEqual({
        distance: Math.sqrt(2 * v * v),
        point: [0, 0],
      });
    }
  });

  it('edge case: point', () => {
    const { getInfo, isHit } = measureBezier(0, 0, 0, 0, 0, 0);
    expect(isHit(2, 2, 1)).toEqual(false);
    expect(getInfo(2, 2).distance).toEqual(2 * Math.SQRT2);
    for (let i = 0; i <= 10; i++) {
      const v = Math.random();
      expect(getInfo(v, v)).toEqual({
        distance: Math.sqrt(2 * v * v),
        point: [0, 0],
      });
    }
  });
});
