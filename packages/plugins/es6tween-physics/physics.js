
(function () {
  const easings = {};

  easings.spring = (options = {}) => {
    Object.assign(options, easings.spring.defaults);

    const frequency = Math.max(1, options.frequency / 20);
    const friction = Math.pow(20, options.friction / 100);
    const s = options.anticipationSize / 1000;
    const decal = Math.max(0, s);

    // In case of anticipation
    const A1 = function (t) {
      const M = 0.8;

      const x0 = (s / (1 - s));
      const x1 = 0;

      const b = (x0 - (M * x1)) / (x0 - x1);
      const a = (M - b) / x0;

      return ((a * t * options.anticipationStrength) / 100) + b;
    };

    // Normal curve
    const A2 = t => Math.pow(friction / 10, -t) * (1 - t);

    return function (t) {
      let a, A, b;
      const frictionT = (t / (1 - s)) - (s / (1 - s));

      if (t < s) {
        const yS = (s / (1 - s)) - (s / (1 - s));
        const y0 = (0 / (1 - s)) - (s / (1 - s));
        b = Math.acos(1 / A1(yS));
        a = (Math.acos(1 / A1(y0)) - b) / (frequency * (-s));
        A = A1;
      } else {
        A = A2;

        b = 0;
        a = 1;
      }

      const At = A(frictionT);

      const angle = (frequency * (t - s) * a) + b;
      return 1 - (At * Math.cos(angle));
    };
  };

  easings.bounce = (options = {}) => {
    Object.assign(options, easings.bounce.defaults);

    const frequency = Math.max(1, options.frequency / 20);
    const friction = Math.pow(20, options.friction / 100);
    const A = t => Math.pow(friction / 10, -t) * (1 - t);

    const fn = function (t) {

      const b = -3.14 / 2;
      const a = 1;

      const At = A(t);

      const angle = (frequency * t * a) + b;
      return (At * Math.cos(angle));
    };
    fn.returnsToSelf = true;
    return fn;
  };

  easings.gravity = function (options = {}) {
    Object.assign(options, easings.gravity.defaults);

    const bounciness = Math.min((options.bounciness / 1250), 0.8);
    const elasticity = options.elasticity / 1000;
    const gravity = 100;

    const curves = [];
    const L = (function () {
      const b = Math.sqrt(2 / gravity);
      let curve = { a: -b, b, H: 1 };
      if (options.returnsToSelf) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      while (curve.H > 0.001) {
        L = curve.b - curve.a;
        curve = { a: curve.b, b: curve.b + (L * bounciness), H: curve.H * bounciness * bounciness };
      }
      return curve.b;
    })();

    const getPointInCurve = function (a, b, H, t) {
      L = b - a;
      const t2 = ((2 / L) * (t)) - 1 - ((a * 2) / L);
      let c = ((t2 * t2 * H) - H) + 1;
      if (options.returnsToSelf) { c = 1 - c; }
      return c;
    };

    // Create curves
    (function () {
      const b = Math.sqrt(2 / (gravity * L * L));
      let curve = { a: -b, b, H: 1 };
      if (options.returnsToSelf) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      curves.push(curve);
      let L2 = L;
      return (() => {
        const result = [];
        while ((curve.b < 1) && (curve.H > 0.001)) {
          L2 = curve.b - curve.a;
          curve = { a: curve.b, b: curve.b + (L2 * bounciness), H: curve.H * elasticity };
          result.push(curves.push(curve));
        }
        return result;
      })();
    })();

    const fn = function (t) {
      let v;
      let i = 0;
      let curve = curves[i];
      while (!((t >= curve.a) && (t <= curve.b))) {
        i += 1;
        curve = curves[i];
        if (!curve) { break; }
      }

      if (!curve) {
        v = options.returnsToSelf ? 0 : 1;
      } else {
        v = getPointInCurve(curve.a, curve.b, curve.H, t);
      }
      return v;
    };
    fn.returnsToSelf = options.returnsToSelf;
    return fn;
  };

  easings.forceWithGravity = function (options = {}) {
    Object.assign(options, easings.forceWithGravity.defaults);
    options.returnsToSelf = true;
    return easings.gravity(options);
  };

  easings.bezier = (function () {
    const Bezier_ = (t, p0, p1, p2, p3) => (Math.pow(1 - t, 3) * p0) + (3 * Math.pow(1 - t, 2) * t * p1) + (3 * (1 - t) * Math.pow(t, 2) * p2) + (Math.pow(t, 3) * p3);

    const Bezier = (t, p0, p1, p2, p3) =>
      ({
        x: Bezier_(t, p0.x, p1.x, p2.x, p3.x),
        y: Bezier_(t, p0.y, p1.y, p2.y, p3.y)
      })
      ;

    const yForX = function (xTarget, Bs, returnsToSelf) {
      // Find the right Bezier curve first
      let B = null;
      for (let aB of Bs) {
        if ((xTarget >= aB(0).x) && (xTarget <= aB(1).x)) {
          B = aB;
        }
        if (B !== null) { break; }
      }

      if (!B) {
        if (returnsToSelf) {
          return 0;
        } else {
          return 1;
        }
      }

      // Find the percent with dichotomy
      const xTolerance = 0.0001;
      let lower = 0;
      let upper = 1;
      let percent = (upper + lower) / 2;

      let { x } = B(percent);
      let i = 0;

      while ((Math.abs(xTarget - x) > xTolerance) && (i < 100)) {
        if (xTarget > x) {
          lower = percent;
        } else {
          upper = percent;
        }

        percent = (upper + lower) / 2;
        ({ x } = B(percent));
        i += 1;
      }

      // Returns y at this specific percent
      return B(percent).y;
    };

    // Actual bezier function
    return function (options = {}) {
      const { points } = options;

      // Init different curves
      const Bs = (function () {
        Bs = [];
        for (let i in points) {
          const k = parseInt(i);
          if (k >= (points.length - 1)) { break; }
          (function (pointA, pointB) {
            const B2 = t => Bezier(t, pointA, pointA.cp[pointA.cp.length - 1], pointB.cp[0], pointB);
            return Bs.push(B2);
          })(points[k], points[k + 1]);
        }
        return Bs;
      })();

      const fn = function (t) {
        if (t === 0) {
          return 0;
        } else if (t === 1) {
          return 1;
        } else {
          return yForX(t, Bs, this.returnsToSelf);
        }
      };
      fn.returnsToSelf = points[points.length - 1].y === 0;
      return fn;
    };
  })();

  easings.easeInOut = (options = {}) => {
    const friction = options.friction != null ? options.friction : easings.easeInOut.defaults.friction;
    return easings.bezier({
      points: [
        { x: 0, y: 0, cp: [{ x: 0.92 - (friction / 1000), y: 0 }] },
        { x: 1, y: 1, cp: [{ x: 0.08 + (friction / 1000), y: 1 }] }
      ]
    });
  };

  easings.easeIn = function (options = {}) {
    const friction = options.friction != null ? options.friction : easings.easeIn.defaults.friction;
    return easings.bezier({
      points: [
        { x: 0, y: 0, cp: [{ x: 0.92 - (friction / 1000), y: 0 }] },
        { x: 1, y: 1, cp: [{ x: 1, y: 1 }] }
      ]
    });
  };

  easings.easeOut = function (options = {}) {
    const friction = options.friction != null ? options.friction : easings.easeOut.defaults.friction;
    return easings.bezier({
      points: [
        { x: 0, y: 0, cp: [{ x: 0, y: 0 }] },
        { x: 1, y: 1, cp: [{ x: 0.08 + (friction / 1000), y: 1 }] }
      ]
    });
  };

  // Default options
  easings.spring.defaults = {
    frequency: 300,
    friction: 200,
    anticipationSize: 0,
    anticipationStrength: 0
  };
  easings.bounce.defaults = {
    frequency: 300,
    friction: 200
  };
  easings.forceWithGravity.defaults = (easings.gravity.defaults = {
    bounciness: 400,
    elasticity: 200
  });
  easings.easeInOut.defaults = (easings.easeIn.defaults = (easings.easeOut.defaults =
    { friction: 500 }));

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = easings;
    module.exports.defaults = easings;
  } else if (typeof global !== 'undefined' && typeof window === 'undefined') {
    if (!global.Physics) {
      global.Physics = easings;
    } else {
      global.TweenPhysics = easings;
    }
  } else if (typeof window !== 'defined' && window.document) {
    if (!window.Physics) {
      window.Physics = easings;
    } else {
      window.TweenPhysics = easings;
    }
  } else if (typeof define === 'function' && define.amd) {
    define([], () => easings);
  } else if (typeof exports !== 'undefined' && typeof module === 'undefined') {
    exports.default = easings;
    if (!exports.Physics) {
      exports.Physics = easings;
    } else {
      exports.TweenPhysics = easings;
    }
  }
}());