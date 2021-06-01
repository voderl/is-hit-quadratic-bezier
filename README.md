# Is Hit Quadratic Bezier 

## demo
add later

## usage
```js
import measureBezier from 'is-hit-quadratic-bezier';
```
three usage examples:
```js
const { isHit, getInfo } = measureBezier(fromX, fromY, controlPointX, controlPointY, toX, toY);

const { isHit, getInfo } = measureBezier([fromX, fromY], [controlPointX, controlPointY], [toX, toY]);

const { isHit, getInfo } = measureBezier({
  x: fromX,
  y:  fromY,
}, {
  x: controlPointX,
  y: controlPointY,
}, {
  x: toX,
  y: toY,
});
```
## isHit
Determine whether the distance from a point to the bezier curve is less than `hitDistance`
```js
isHit(x,y, hitDistance); // true or false
isHit({
  x: x,
  y: y
}, hitDistance); 
isHit([x,y], hitDistance);
```

## getInfo
calculate the distance from a point to the bezier curve, the closest point in bezier curve.
```js
const { distance, point } = getInfo(x, y);
const { distance, point } = getInfo([x, y]);
const { distance, point } = getInfo({
  x: x,
  y: y
})
```
## reference
The calculation algorithm comes from : 
https://www.shadertoy.com/view/MlKcDD
https://www.shadertoy.com/view/4dsfRS
