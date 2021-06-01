/**
 * Reference:
 * https://www.shadertoy.com/view/MlKcDD
 * https://www.shadertoy.com/view/4dsfRS
 */
/**
// The MIT License
// Copyright © 2018 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// Distance to a quadratic bezier segment, which can be solved analyically with a cubic.
// List of some other 2D distances: https://www.shadertoy.com/playlist/MXdSRf
// and www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float dot2( in vec2 v ) { return dot(v,v); }
float cross2( in vec2 a, in vec2 b ) { return a.x*b.y - a.y*b.x; }
    
// unsigned distance to a quadratic bezier
float udBezier( in vec2 pos, in vec2 A, in vec2 B, in vec2 C )
{    
    vec2 a = B - A;
    vec2 b = A - 2.0*B + C;
    vec2 c = a * 2.0;
    vec2 d = A - pos;

    float kk = 1.0/dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b))/3.0;
    float kz = kk * dot(d,a);      

    float res = 0.0;

    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
    float h = q*q + 4.0*p3;

    if( h>=0.0 ) 
    {   // 1 root
        h = sqrt(h);
        vec2 x = (vec2(h,-h)-q)/2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        float t = clamp( uv.x+uv.y-kx, 0.0, 1.0 );
        res = dot2(d+(c+b*t)*t);
    }
    else 
    {   // 3 roots
        float z = sqrt(-p);
        float v = acos(q/(p*z*2.0))/3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3  t = clamp( vec3(m+m,-n-m,n-m)*z-kx, 0.0, 1.0 );
        res = min( dot2(d+(c+b*t.x)*t.x),
                   dot2(d+(c+b*t.y)*t.y) );
        // the third root cannot be the closest. See https://www.shadertoy.com/view/4dsfRS
        // res = min(res,dot2(d+(c+b*t.z)*t.z));
    }
    
    return sqrt( res );
}

// signed distance to a quadratic bezier
float sdBezier( in vec2 pos, in vec2 A, in vec2 B, in vec2 C )
{    
    vec2 a = B - A;
    vec2 b = A - 2.0*B + C;
    vec2 c = a * 2.0;
    vec2 d = A - pos;

    float kk = 1.0/dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b))/3.0;
    float kz = kk * dot(d,a);      

    float res = 0.0;
    float sgn = 0.0;

    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
    float h = q*q + 4.0*p3;

    if( h>=0.0 ) 
    {   // 1 root
        h = sqrt(h);
        vec2 x = (vec2(h,-h)-q)/2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        float t = clamp( uv.x+uv.y-kx, 0.0, 1.0 );
        vec2  q = d+(c+b*t)*t;
        res = dot2(q);
    	sgn = cross2(c+2.0*b*t,q);
    }
    else 
    {   // 3 roots
        float z = sqrt(-p);
        float v = acos(q/(p*z*2.0))/3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3  t = clamp( vec3(m+m,-n-m,n-m)*z-kx, 0.0, 1.0 );
        vec2  qx=d+(c+b*t.x)*t.x; float dx=dot2(qx), sx = cross2(c+2.0*b*t.x,qx);
        vec2  qy=d+(c+b*t.y)*t.y; float dy=dot2(qy), sy = cross2(c+2.0*b*t.y,qy);
        if( dx<dy ) { res=dx; sgn=sx; } else {res=dy; sgn=sy; }
    }
    
    return sqrt( res )*sign(sgn);
}

float udSegment( in vec2 p, in vec2 a, in vec2 b )
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    
	vec2 v0 = vec2(1.3,0.9)*cos(iTime*0.5 + vec2(0.0,5.0) );
    vec2 v1 = vec2(1.3,0.9)*cos(iTime*0.6 + vec2(3.0,4.0) );
    vec2 v2 = vec2(1.3,0.9)*cos(iTime*0.7 + vec2(2.0,0.0) );
    
    float d = sdBezier( p, v0,v1,v2 ); 
    
    float f = smoothstep(-0.2,0.2,cos(2.0*iTime));
    vec3 col = vec3(1.0) - vec3(0.1,0.4,0.7)*mix(sign(d),1.0,f);
	col *= 1.0 - exp(-4.0*abs(d));
	col *= 0.8 + 0.2*cos(140.0*d);
	col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.015,abs(d)) );
    
    if( cos(0.5*iTime)<-0.5 )
    {
        d = min( udSegment(p,v0,v1),
                 udSegment(p,v1,v2) );
        d = min( d, length(p-v0)-0.02 );
        d = min( d, length(p-v1)-0.02 );
        d = min( d, length(p-v2)-0.02 );
        col = mix( col, vec3(1,0,0), 1.0-smoothstep(0.0,0.007,d) );
    }

	fragColor = vec4(col,1.0);
}
 */
const sqrt = Math.sqrt;
const min = Math.min;
const sign = Math.sign;
const abs = Math.abs;
const pow = Math.pow;
const acos = Math.acos;
const cos = Math.cos;
const sin = Math.sin;
function clamp(x, min, max) {
  return Math.min(Math.max(x, min), max);
}
function dot(x, y) {
  return x[0] * y[0] + x[1] * y[1];
}
function dot2(a, b) {
  return a * a + b * b;
}
export default function createCalDistanceToBezier(sX, sY, cpX, cpY, eX, eY) {
  const a = [cpX - sX, cpY - sY];
  const b = [sX - 2 * cpX + eX, sY - 2 * cpY + eY];
  const c = [2 * a[0], 2 * a[1]];
  const kk = 1 / dot(b, b);
  const kx = kk * dot(a, b);
  const kx_2 = kx * kx;
  const dot_a = dot(a, a);
  function calBezierTValues(d: [number, number]) {
    const ky = (kk * (2.0 * dot_a + dot(d, b))) / 3.0;
    const kz = kk * dot(d, a);
    const p = ky - kx_2;
    const p3 = p * p * p;
    const q = kx * (2.0 * kx_2 - 3.0 * ky) + kz;
    let h = q * q + 4.0 * p3;
    if (h >= 0.0) {
      h = sqrt(h);
      const x_0 = (h - q) / 2.0;
      const x_1 = (-h - q) / 2.0;
      const t = clamp(
        sign(x_0) * pow(abs(x_0), 1 / 3) +
          sign(x_1) * pow(abs(x_1), 1 / 3) -
          kx,
        0.0,
        1.0
      );
      return t;
    } else {
      const z = sqrt(-p);
      const v = acos(q / (p * z * 2.0)) / 3.0;
      const m = cos(v);
      const n = sin(v) * 1.732050808;
      const t_0 = clamp((m + m) * z - kx, 0, 1);
      const t_1 = clamp((-n - m) * z - kx, 0, 1);
      return [t_0, t_1];
    }
  }
  return {
    getDistance(pX, pY): number {
      const d: [number, number] = [sX - pX, sY - pY];
      const t = calBezierTValues(d);
      if (typeof t === 'number') {
        return sqrt(
          dot2((c[0] + b[0] * t) * t + d[0], (c[1] + b[1] * t) * t + d[1])
        );
      }
      const [t_0, t_1] = t as [number, number];
      return sqrt(
        min(
          dot2(
            d[0] + (c[0] + b[0] * t_0) * t_0,
            d[1] + (c[1] + b[1] * t_0) * t_0
          ),
          dot2(
            d[0] + (c[0] + b[0] * t_1) * t_1,
            d[1] + (c[1] + b[1] * t_1) * t_1
          )
        )
      );
    },
    getInfo(
      pX,
      pY
    ): {
      distance: number;
      point: [number, number];
    } {
      const d: [number, number] = [sX - pX, sY - pY];
      const t = calBezierTValues(d);
      if (typeof t === 'number') {
        const p_x = (c[0] + b[0] * t) * t + d[0];
        const p_y = (c[1] + b[1] * t) * t + d[1];
        return {
          distance: sqrt(dot2(p_x, p_y)),
          point: [p_x + pX, p_y + pY],
        };
      }
      const [t_0, t_1] = t as [number, number];
      const p_0_x = (c[0] + b[0] * t_0) * t_0 + d[0];
      const p_0_y = (c[1] + b[1] * t_0) * t_0 + d[1];
      const p_1_x = (c[0] + b[0] * t_1) * t_1 + d[0];
      const p_1_y = (c[1] + b[1] * t_1) * t_1 + d[1];
      const d_0 = dot2(p_0_x, p_0_y);
      const d_1 = dot2(p_1_x, p_1_y);
      return d_0 >= d_1
        ? {
            distance: sqrt(d_1),
            point: [p_1_x + pX, p_1_y + pY],
          }
        : {
            distance: sqrt(d_0),
            point: [p_0_x + pX, p_0_y + pY],
          };
    },
  };
}
