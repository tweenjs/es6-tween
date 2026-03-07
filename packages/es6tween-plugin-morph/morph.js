var es6TweenMorphPlugin = (function (es6Tween,flubber) {
  'use strict';

  flubber = flubber && flubber.hasOwnProperty('default') ? flubber['default'] : flubber;

  /** global: bx */

  var applyFuncToShapes = function (f, s) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    if (isShapeArray(s)) {
      return s.map(function (shape) { return f.apply(void 0, [ shape ].concat( args )); })
    }

    return f.apply(void 0, [ s ].concat( args ))
  };

  var getShapeArray = function (s) { return isShapeArray(s) ? s : [ s ]; };

  var isShapeArray = function (s) { return s && Array.isArray(s[ 0 ]); };

  var numberAtInterval = function (a, b, interval) {
    var c = a === b ? 0 : Math.abs(b - a);
    return c === 0 ? a : (a < b ? a + c * interval : a - c * interval)
  };

  var distance = function (ref, ref$1) {
    var x = ref.x;
    var y = ref.y;
    var bx = ref$1.x;
    var by = ref$1.y;

    return Math.sqrt((x - bx) * (x - bx) + (y - by) * (y - by))
  };

  var sqrt = function (ref) {
    var x = ref.x;
    var y = ref.y;

    return Math.sqrt(x * x + y * y);
  };

  var splitSubPath = function (points) {
    return points.reduce(function (lines, point) {
      if (point.moveTo) {
        lines.push([]);
      }

      lines[lines.length - 1].push(point);

      return lines
    }, [])
  };

  var countSubPath = function (points) { return points.reduce(function (count, point) { return point.moveTo ? count + 1 : count; }, 0); };

  var joinSubPath = function (shapes) { return shapes.reduce(function (prev, shape) { return prev.concat(shape); }, []); };

  var countLinePoints = function (lines) { return lines.reduce(function (count, points) { return (
    count + countPoints(points)
  ); }, 0); };

  var countPoints = function (points) { return points.length - (isJoined(points) ? 1 : 0); };

  var isJoined = function (points) {
    var firstPoint = points[ 0 ];
    var lastPoint = points[ points.length - 1 ];
    return firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y
  };

  var joinLines = function (lines) { return lines.reduce(function (shape, line) { return (
    shape.concat( line )
  ); }, []); };

  var nextIndex = function (lines, offset) {
    for (var i = 0, l = lines.length; i < l; i++) {
      var count = countPoints(lines[ i ]);

      if (offset <= count - 1) {
        return {
          lineIndex: i,
          pointIndex: offset
        }
      }

      offset -= count;
    }
  };

  var reorderLines = function (lines, offset) { return [].concat( lines )
    .splice(offset)
    .concat([].concat( lines ).splice(0, offset)); };

  var reorderPoints = function (points, offset) {
    if (!offset) {
      return points
    }

    var nextPoints = [
      { x: points[ offset ].x, y: points[ offset ].y, moveTo: true } ].concat( [].concat( points ).splice(offset + 1)
    );

    if (isJoined(points)) {
      return nextPoints.concat( [].concat( points ).splice(1, offset)
      )
    }

    return nextPoints.concat( [].concat( points ).splice(0, offset + 1)
    )
  };

  var splitLines = function (shape) { return shape.reduce(function (lines, point) {
    if (point.moveTo) {
      lines.push([]);
    }

    lines[ lines.length - 1 ].push(point);

    return lines
  }, []); };

  var movePointsIndex = function (shape, offset) {
    var lines = splitLines(shape);
    var count = countLinePoints(lines);
    var normalisedOffset = ((offset % count) + count) % count;

    if (!normalisedOffset) {
      return shape
    }

    var ref = nextIndex(lines, normalisedOffset);
    var lineIndex = ref.lineIndex;
    var pointIndex = ref.pointIndex;
    var reorderedLines = reorderLines(lines, lineIndex);
    var firstLine = reorderPoints(reorderedLines[ 0 ], pointIndex);
    var restOfLines = [].concat( reorderedLines ).splice(1);

    return joinLines([ firstLine ].concat( restOfLines ))
  };

  var moveIndex = function (s, offset) { return applyFuncToShapes(movePointsIndex, s, offset); };

  function autoIndexPoints (ring, vs) {
    var len = ring.length;
    var min = Infinity;
    var bestOffset;
    var sumOfSquares;
    var d;

    for (var offset = 0; offset < len; offset++) {
      sumOfSquares = 0;

      for (var i = 0, len$1 = vs.length; i < len$1; i++) {
        d = distance(ring[Math.min((offset + i) % len$1, ring.length - 1)], vs[i]);
        sumOfSquares += d * d;
      }

      if (sumOfSquares < min) {
        min = sumOfSquares;
        bestOffset = offset;
      }
    }

    if (bestOffset) {
      ring = moveIndex(ring, bestOffset);
    }
    return ring
  }

  var autoIndex = function (fromShape, toShape) { return applyFuncToShapes(autoIndexPoints, fromShape, toShape); };

  var autoCurveSinglePoint = function (fromShape, toShape) {
    for (var index = 0, len = fromShape.length; index < len; index++) {
      var point = fromShape[index];
      var point2 = toShape[index];
      if (point2 && !point.curve && point2.curve && !point.moveTo) {
        var prevPoint = index === 0 ? null : fromShape[index - 1];
        point.curve = {
          type: 'cubic',
          x1: prevPoint.x,
          y1: prevPoint.y,
          x2: point.x,
          y2: point.y
        };
      }
    }
    return fromShape
  };

  var autoCurvePoint = function (fromShape, toShape) { return applyFuncToShapes(autoCurveSinglePoint, fromShape, toShape); };

  // I extracted this from the a2c function from
  // SVG path – https://github.com/fontello/svgpath
  //
  // All credit goes to:
  //
  // Sergey Batishchev – https://github.com/snb2013
  // Vitaly Puzrin – https://github.com/puzrin
  // Alex Kocharin – https://github.com/rlidwka
  /** global: x1 */
  /** global: x2 */
  /** global: y1 */
  /** global: y2 */

  var TAU = Math.PI * 2;

  var mapToEllipse = function (ref, rx, ry, cosphi, sinphi, centerx, centery) {
    var x = ref.x;
    var y = ref.y;

    x *= rx;
    y *= ry;

    var xp = cosphi * x - sinphi * y;
    var yp = sinphi * x + cosphi * y;

    return {
      x: xp + centerx,
      y: yp + centery
    }
  };

  var approxUnitArc = function (ang1, ang2) {
    var a = 4 / 3 * Math.tan(ang2 / 4);

    var x1 = Math.cos(ang1);
    var y1 = Math.sin(ang1);
    var x2 = Math.cos(ang1 + ang2);
    var y2 = Math.sin(ang1 + ang2);

    return [
      {
        x: x1 - y1 * a,
        y: y1 + x1 * a
      },
      {
        x: x2 + y2 * a,
        y: y2 - x2 * a
      },
      {
        x: x2,
        y: y2
      }
    ]
  };

  var vectorAngle = function (ux, uy, vx, vy) {
    var sign = (ux * vy - uy * vx < 0) ? -1 : 1;
    var umag = Math.sqrt(ux * ux + uy * uy);
    var vmag = Math.sqrt(ux * ux + uy * uy);
    var dot = ux * vx + uy * vy;

    var div = dot / (umag * vmag);

    if (div > 1) {
      div = 1;
    }

    if (div < -1) {
      div = -1;
    }

    return sign * Math.acos(div)
  };

  var getArcCenter = function (
    px,
    py,
    cx,
    cy,
    rx,
    ry,
    largeArcFlag,
    sweepFlag,
    sinphi,
    cosphi,
    pxp,
    pyp
  ) {
    var rxsq = Math.pow(rx, 2);
    var rysq = Math.pow(ry, 2);
    var pxpsq = Math.pow(pxp, 2);
    var pypsq = Math.pow(pyp, 2);

    var radicant = (rxsq * rysq) - (rxsq * pypsq) - (rysq * pxpsq);

    if (radicant < 0) {
      radicant = 0;
    }

    radicant /= (rxsq * pypsq) + (rysq * pxpsq);
    radicant = Math.sqrt(radicant) * (largeArcFlag === sweepFlag ? -1 : 1);

    var centerxp = radicant * rx / ry * pyp;
    var centeryp = radicant * -ry / rx * pxp;

    var centerx = cosphi * centerxp - sinphi * centeryp + (px + cx) / 2;
    var centery = sinphi * centerxp + cosphi * centeryp + (py + cy) / 2;

    var vx1 = (pxp - centerxp) / rx;
    var vy1 = (pyp - centeryp) / ry;
    var vx2 = (-pxp - centerxp) / rx;
    var vy2 = (-pyp - centeryp) / ry;

    var ang1 = vectorAngle(1, 0, vx1, vy1);
    var ang2 = vectorAngle(vx1, vy1, vx2, vy2);

    if (sweepFlag === 0 && ang2 > 0) {
      ang2 -= TAU;
    }

    if (sweepFlag === 1 && ang2 < 0) {
      ang2 += TAU;
    }

    return [ centerx, centery, ang1, ang2 ]
  };

  var arcToBezier = function (ref) {
    var px = ref.px;
    var py = ref.py;
    var cx = ref.cx;
    var cy = ref.cy;
    var rx = ref.rx;
    var ry = ref.ry;
    var xAxisRotation = ref.xAxisRotation; if ( xAxisRotation === void 0 ) xAxisRotation = 0;
    var largeArcFlag = ref.largeArcFlag; if ( largeArcFlag === void 0 ) largeArcFlag = 0;
    var sweepFlag = ref.sweepFlag; if ( sweepFlag === void 0 ) sweepFlag = 0;

    var curves = [];

    if (rx === 0 || ry === 0) {
      return []
    }

    var sinphi = Math.sin(xAxisRotation * TAU / 360);
    var cosphi = Math.cos(xAxisRotation * TAU / 360);

    var pxp = cosphi * (px - cx) / 2 + sinphi * (py - cy) / 2;
    var pyp = -sinphi * (px - cx) / 2 + cosphi * (py - cy) / 2;

    if (pxp === 0 && pyp === 0) {
      return []
    }

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    var lambda =
      Math.pow(pxp, 2) / Math.pow(rx, 2) +
      Math.pow(pyp, 2) / Math.pow(ry, 2);

    if (lambda > 1) {
      rx *= Math.sqrt(lambda);
      ry *= Math.sqrt(lambda);
    }

    var ref$1 = getArcCenter(
      px,
      py,
      cx,
      cy,
      rx,
      ry,
      largeArcFlag,
      sweepFlag,
      sinphi,
      cosphi,
      pxp,
      pyp
    );
    var centerx = ref$1[0];
    var centery = ref$1[1];
    var ang1 = ref$1[2];
    var ang2 = ref$1[3];

    var segments = Math.max(Math.ceil(Math.abs(ang2) / (TAU / 4)), 1);

    ang2 /= segments;

    for (var i = 0; i < segments; i++) {
      curves.push(approxUnitArc(ang1, ang2));
      ang1 += ang2;
    }

    return curves.map(function (curve) {
      var ref = mapToEllipse(curve[ 0 ], rx, ry, cosphi, sinphi, centerx, centery);
      var x1 = ref.x;
      var y1 = ref.y;
      var ref$1 = mapToEllipse(curve[ 1 ], rx, ry, cosphi, sinphi, centerx, centery);
      var x2 = ref$1.x;
      var y2 = ref$1.y;
      var ref$2 = mapToEllipse(curve[ 2 ], rx, ry, cosphi, sinphi, centerx, centery);
      var x = ref$2.x;
      var y = ref$2.y;

      return { curve: { type: 'cubic', x1: x1, y1: y1, x2: x2, y2: y2 }, x: x, y: y }
    })
  };

  /** global: px */

  var cubifyShape = function (shape) {
    var i = 0;
    while (i < shape.length) {
      var point = shape[ i ];

      if (point.curve && point.curve.type !== 'cubic') {
        var ref = shape[ i - 1 ];
        var px = ref.x;
        var py = ref.y;
        var cx = point.x;
        var cy = point.y;

        if (point.curve.type === 'arc') {
          var curves = arcToBezier({
            px: px,
            py: py,
            cx: cx,
            cy: cy,
            rx: point.curve.rx,
            ry: point.curve.ry,
            xAxisRotation: point.curve.xAxisRotation,
            largeArcFlag: point.curve.largeArcFlag,
            sweepFlag: point.curve.sweepFlag
          });

          curves.forEach(function (point, offset) {
            shape.splice(i + offset, offset === 0 ? 1 : 0, point);
          });
        } else if (point.curve.type === 'quadratic') {
          var x1 = px + (2 / 3 * (point.curve.x1 - px));
          var y1 = py + (2 / 3 * (point.curve.y1 - py));
          var x2 = cx + (2 / 3 * (point.curve.x1 - cx));
          var y2 = cy + (2 / 3 * (point.curve.y1 - cy));

          var curve = point.curve;

          curve.type = 'cubic';
          curve.x1 = x1;
          curve.y1 = y1;
          curve.x2 = x2;
          curve.y2 = y2;

          i++;
        }
      } else if (i > 0 && point.moveTo) {
        if (shape[i - 1].moveTo) {
          delete point.moveTo;
        }
        i++;
      } else {
        i++;
      }
    }

    return shape
  };

  var cubify = function (s) { return applyFuncToShapes(cubifyShape, s); };

  var linearPoints = function (from, to, t) {
    if ( t === void 0 ) t = 0.5;

    return [
    {
      x: numberAtInterval(from.x, to.x, t),
      y: numberAtInterval(from.y, to.y, t)
    },
    to
  ];
  };

  var curvedPoints = function (from, to, t) {
    if ( t === void 0 ) t = 0.5;

    var ref = to.curve;
    var x1 = ref.x1;
    var y1 = ref.y1;
    var x2 = ref.x2;
    var y2 = ref.y2;

    var A = { x: from.x, y: from.y };
    var B = { x: x1, y: y1 };
    var C = { x: x2, y: y2 };
    var D = { x: to.x, y: to.y };
    var E = { x: numberAtInterval(A.x, B.x, t), y: numberAtInterval(A.y, B.y, t) };
    var F = { x: numberAtInterval(B.x, C.x, t), y: numberAtInterval(B.y, C.y, t) };
    var G = { x: numberAtInterval(C.x, D.x, t), y: numberAtInterval(C.y, D.y, t) };
    var H = { x: numberAtInterval(E.x, F.x, t), y: numberAtInterval(E.y, F.y, t) };
    var J = { x: numberAtInterval(F.x, G.x, t), y: numberAtInterval(F.y, G.y, t) };
    var K = { x: numberAtInterval(H.x, J.x, t), y: numberAtInterval(H.y, J.y, t) };

    return [
      { x: K.x, y: K.y, curve: { type: 'cubic', x1: E.x, y1: E.y, x2: H.x, y2: H.y } },
      { x: D.x, y: D.y, curve: { type: 'cubic', x1: J.x, y1: J.y, x2: G.x, y2: G.y } }
    ]
  };

  var points = function (from, to, t) {
    if ( t === void 0 ) t = 0.5;

    return to.curve
    ? curvedPoints(from, to, t)
    : linearPoints(from, to, t);
  };

  var addPoints = function (shape, pointsRequired) {
    if (shape.length >= pointsRequired) {
      return shape
    }

    var maxDist = 0;
    var maxDistIndex = 1;

    if (shape.length === 1) {
      var ref = shape[0];
      var x = ref.x;
      var y = ref.y;
      for (var i = 1, req = pointsRequired; i < req; i++) {
        shape.push({x: x, y: y});
      }
      return shape
    }

    for (var i$1 = 1, len = shape.length; i$1 < len; i$1++) {
      var point = shape[i$1];
      var prevPoint = shape[i$1 - 1];

      if (point.moveTo) {
        continue
      } else {
        var dist = distance(prevPoint, point);
        if (dist > maxDist) {
          maxDist = dist;
          maxDistIndex = i$1;
        }
      }
    }

    var ref$1 = points(shape[maxDistIndex - 1], shape[maxDistIndex]);
    var midPoint = ref$1[0];
    var replacementPoint = ref$1[1];

    shape.splice(maxDistIndex, 1, midPoint, replacementPoint);

    return addPoints(shape, pointsRequired)
  };

  var add = function (shape, pointsRequired) { return addPoints(cubify(shape), pointsRequired); };

  var isBetween = function (a, b, c) {
    if (b.curve || c.curve) {
      return false
    }

    var crossProduct =
      (c.y - a.y) *
      (b.x - a.x) -
      (c.x - a.x) *
      (b.y - a.y);

    if (Math.abs(crossProduct) > Number.EPSILON) {
      return false
    }

    var dotProduct =
      (c.x - a.x) *
      (b.x - a.x) +
      (c.y - a.y) *
      (b.y - a.y);

    if (dotProduct < 0) {
      return false
    }

    var squaredLengthBA =
      (b.x - a.x) *
      (b.x - a.x) +
      (b.y - a.y) *
      (b.y - a.y);

    if (dotProduct > squaredLengthBA) {
      return false
    }

    return true
  };

  var removePoints = function (shape) {
    var s = [];

    for (var i = 0, l = shape.length; i < l; i++) {
      var a = s[ s.length - 1 ];
      var b = shape[ i + 1 ];
      var c = shape[ i ];

      if (!(a && b && c) || !(isBetween(a, b, c))) {
        s.push(c);
      }
    }

    return s
  };

  var remove = function (s) { return applyFuncToShapes(removePoints, s); };

  var reversePoints = function (shape) {
    var m;
    var c;

    return shape.reverse().map(function (ref, i) {
      var x = ref.x;
      var y = ref.y;
      var moveTo = ref.moveTo;
      var curve = ref.curve;

      var point = { x: x, y: y };

      if (c) {
        var x2 = c.x1;
        var y2 = c.y1;
        var x1 = c.x2;
        var y1 = c.y2;
        point.curve = { type: 'cubic', x1: x1, y1: y1, x2: x2, y2: y2 };
      }

      if (i === 0 || m) {
        point.moveTo = true;
      }

      m = moveTo;
      c = curve || null;

      return point
    })
  };

  var reverse = function (s) { return applyFuncToShapes(reversePoints, cubify(s)); };

  var boundingBox = function (s) {
    var bottom;
    var left;
    var right;
    var top;

    var shapes = getShapeArray(s);

    shapes.map(function (shape) { return shape.map(function (ref) {
      var x = ref.x;
      var y = ref.y;

      if (typeof bottom !== 'number' || y > bottom) {
        bottom = y;
      }

      if (typeof left !== 'number' || x < left) {
        left = x;
      }

      if (typeof right !== 'number' || x > right) {
        right = x;
      }

      if (typeof top !== 'number' || y < top) {
        top = y;
      }
    }); });

    return {
      bottom: bottom,
      center: {
        x: left + ((right - left) / 2),
        y: top + ((bottom - top) / 2)
      },
      left: left,
      right: right,
      top: top
    }
  };

  /** global: x1 */
  /** global: x2 */
  /** global: y1 */
  /** global: y2 */

  var length = function (s) {
    return s.reduce(function (currentLength, ref, i) {
      var x2 = ref.x;
      var y2 = ref.y;
      var moveTo = ref.moveTo;

      if (!moveTo) {
        var ref$1 = s[ i - 1 ];
        var x1 = ref$1.x;
        var y1 = ref$1.y;
        currentLength += linearLength(x1, y1, x2, y2);
      }

      return currentLength
    }, 0)
  };

  var linearLength = function (x1, y1, x2, y2) { return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
  ); };

  /** global: x1 */

  var areaPoints = function (polygon) {
    return polygon.reduce(function (area, ref, i) {
      var x = ref.x;
      var y = ref.y;

      var ref$1 = i === 0 ? polygon[polygon.length - 1] : polygon[i - 1];
      var x1 = ref$1.x;
      var y1 = ref$1.y;
      area += ((x1 + x) * (y1 - y)) / 2;
      return area
    }, 0)
  };

  var area = function (polygon) { return applyFuncToShapes(areaPoints, polygon); };

  var mapList = {
    default: function default$1 () {
      return 0
    },
    byPoint: function byPoint (a, b) {
      return b.length - a.length
    },
    bySqrt: function bySqrt (a, b) {
      return sqrt(boundingBox(a).center) - sqrt(boundingBox(b).center)
    },
    byX: function byX (b, a) {
      return b[0].x - a[0].x
    },
    byY: function byY (b, a) {
      return b[0].y - a[0].y
    },
    byBBox: function byBBox (a, b) {
      var bb = boundingBox(b)
        .center;

      var aa = boundingBox(a)
      .center;

      return (bb.x + bb.y) - (aa.x + aa.y)
    },
    byDirection: function byDirection (a, b) {
      return area(b) - area(a)
    },
    auto: function auto (a, b) {
      return b.length - a.length || sqrt(boundingBox(a).center) - sqrt(boundingBox(b).center) || length(b) - length(a) || area(b) - area(a)
    },
    byLength: function byLength (a, b) {
      return length(b) - length(a)
    },
    get: function get (type) {
      return typeof (type) === 'function' ? type : typeof (type) === 'string' && (type in mapList)
        ? mapList[type] : null
    }
  };

  var findNearestIndexPoints = function (points, p, box) {
    if ( box === void 0 ) box = false;

    var min = Infinity;
    var isBBoxUse = box !== false;
    var bbox = isBBoxUse ? boundingBox(points).center : p;

    if (isBBoxUse) {
      bbox.x += p.x;
      bbox.y += p.y;
    }

    var bestIndex = 0;

    for (var i = 0, len = points.length; i < len; i++) {
      var sumOfSquares = 0;
      var dist = distance(points[i], bbox);

      sumOfSquares += dist * dist;

      if (sumOfSquares < min) {
        bestIndex = i;
        min = sumOfSquares;
      }
    }

    return points[bestIndex]
  };

  var findNearestIndex = function (points, p, box) { return applyFuncToShapes(findNearestIndexPoints, points, p, box); };

  var _slicedToArray = (function () { function sliceIterator (arr, i) { var _arr = []; var _n = true; var _d = false; var _e; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) { break } } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) { _i['return'](); } } finally { if (_d) { throw _e } } } return _arr } return function (arr, i) { if (Array.isArray(arr)) { return arr } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i) } else { throw new TypeError('Invalid attempt to destructure non-iterable instance') } } }());

  // I extracted this from the a2c function from
  // SVG path – https://github.com/fontello/svgpath
  //
  // All credit goes to:
  //
  // Sergey Batishchev – https://github.com/snb2013
  // Vitaly Puzrin – https://github.com/puzrin
  // Alex Kocharin – https://github.com/rlidwka

  var TAU$1 = Math.PI * 2;

  var mapToEllipse$1 = function mapToEllipse (_ref, rx, ry, cosphi, sinphi, centerx, centery) {
    var x = _ref.x,
      y = _ref.y;

    x *= rx;
    y *= ry;

    var xp = cosphi * x - sinphi * y;
    var yp = sinphi * x + cosphi * y;

    return {
      x: xp + centerx,
      y: yp + centery
    }
  };

  var approxUnitArc$1 = function approxUnitArc (ang1, ang2) {
    var a = 4 / 3 * Math.tan(ang2 / 4);

    var x1 = Math.cos(ang1);
    var y1 = Math.sin(ang1);
    var x2 = Math.cos(ang1 + ang2);
    var y2 = Math.sin(ang1 + ang2);

    return [{
      x: x1 - y1 * a,
      y: y1 + x1 * a
    }, {
      x: x2 + y2 * a,
      y: y2 - x2 * a
    }, {
      x: x2,
      y: y2
    }]
  };

  var vectorAngle$1 = function vectorAngle (ux, uy, vx, vy) {
    var sign = ux * vy - uy * vx < 0 ? -1 : 1;
    var umag = Math.sqrt(ux * ux + uy * uy);
    var vmag = Math.sqrt(ux * ux + uy * uy);
    var dot = ux * vx + uy * vy;

    var div = dot / (umag * vmag);

    if (div > 1) {
      div = 1;
    }

    if (div < -1) {
      div = -1;
    }

    return sign * Math.acos(div)
  };

  var getArcCenter$1 = function getArcCenter (px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp) {
    var rxsq = Math.pow(rx, 2);
    var rysq = Math.pow(ry, 2);
    var pxpsq = Math.pow(pxp, 2);
    var pypsq = Math.pow(pyp, 2);

    var radicant = rxsq * rysq - rxsq * pypsq - rysq * pxpsq;

    if (radicant < 0) {
      radicant = 0;
    }

    radicant /= rxsq * pypsq + rysq * pxpsq;
    radicant = Math.sqrt(radicant) * (largeArcFlag === sweepFlag ? -1 : 1);

    var centerxp = radicant * rx / ry * pyp;
    var centeryp = radicant * -ry / rx * pxp;

    var centerx = cosphi * centerxp - sinphi * centeryp + (px + cx) / 2;
    var centery = sinphi * centerxp + cosphi * centeryp + (py + cy) / 2;

    var vx1 = (pxp - centerxp) / rx;
    var vy1 = (pyp - centeryp) / ry;
    var vx2 = (-pxp - centerxp) / rx;
    var vy2 = (-pyp - centeryp) / ry;

    var ang1 = vectorAngle$1(1, 0, vx1, vy1);
    var ang2 = vectorAngle$1(vx1, vy1, vx2, vy2);

    if (sweepFlag === 0 && ang2 > 0) {
      ang2 -= TAU$1;
    }

    if (sweepFlag === 1 && ang2 < 0) {
      ang2 += TAU$1;
    }

    return [centerx, centery, ang1, ang2]
  };

  var arcToBezier$1 = function arcToBezier (_ref2) {
    var px = _ref2.px,
      py = _ref2.py,
      cx = _ref2.cx,
      cy = _ref2.cy,
      rx = _ref2.rx,
      ry = _ref2.ry,
      _ref2$xAxisRotation = _ref2.xAxisRotation,
      xAxisRotation = _ref2$xAxisRotation === undefined ? 0 : _ref2$xAxisRotation,
      _ref2$largeArcFlag = _ref2.largeArcFlag,
      largeArcFlag = _ref2$largeArcFlag === undefined ? 0 : _ref2$largeArcFlag,
      _ref2$sweepFlag = _ref2.sweepFlag,
      sweepFlag = _ref2$sweepFlag === undefined ? 0 : _ref2$sweepFlag;

    var curves = [];

    if (rx === 0 || ry === 0) {
      return []
    }

    var sinphi = Math.sin(xAxisRotation * TAU$1 / 360);
    var cosphi = Math.cos(xAxisRotation * TAU$1 / 360);

    var pxp = cosphi * (px - cx) / 2 + sinphi * (py - cy) / 2;
    var pyp = -sinphi * (px - cx) / 2 + cosphi * (py - cy) / 2;

    if (pxp === 0 && pyp === 0) {
      return []
    }

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    var lambda = Math.pow(pxp, 2) / Math.pow(rx, 2) + Math.pow(pyp, 2) / Math.pow(ry, 2);

    if (lambda > 1) {
      rx *= Math.sqrt(lambda);
      ry *= Math.sqrt(lambda);
    }

    var _getArcCenter = getArcCenter$1(px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp),
      _getArcCenter2 = _slicedToArray(_getArcCenter, 4),
      centerx = _getArcCenter2[0],
      centery = _getArcCenter2[1],
      ang1 = _getArcCenter2[2],
      ang2 = _getArcCenter2[3];

    var segments = Math.max(Math.ceil(Math.abs(ang2) / (TAU$1 / 4)), 1);

    ang2 /= segments;

    for (var i = 0; i < segments; i++) {
      curves.push(approxUnitArc$1(ang1, ang2));
      ang1 += ang2;
    }

    return curves.map(function (curve) {
      var _mapToEllipse = mapToEllipse$1(curve[0], rx, ry, cosphi, sinphi, centerx, centery),
        x1 = _mapToEllipse.x,
        y1 = _mapToEllipse.y;

      var _mapToEllipse2 = mapToEllipse$1(curve[1], rx, ry, cosphi, sinphi, centerx, centery),
        x2 = _mapToEllipse2.x,
        y2 = _mapToEllipse2.y;

      var _mapToEllipse3 = mapToEllipse$1(curve[2], rx, ry, cosphi, sinphi, centerx, centery),
        x = _mapToEllipse3.x,
        y = _mapToEllipse3.y;

      return { x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y }
    })
  };

  var toPoints = function toPoints (props) {

    switch (props.type) {
      case 'circle':
        return getPointsFromCircle(props)
      case 'ellipse':
        return getPointsFromEllipse(props)
      case 'line':
        return getPointsFromLine(props)
      case 'path':
        return getPointsFromPath(props)
      case 'polygon':
        return getPointsFromPolygon(props)
      case 'polyline':
        return getPointsFromPolyline(props)
      case 'rect':
        return getPointsFromRect(props)
      case 'g':
        return getPointsFromG(props)
      default:
        throw new Error('Not a valid shape type')
    }
  };

  var getPointsFromCircle = function getPointsFromCircle (_ref2) {
    var cx = _ref2.cx,
      cy = _ref2.cy,
      r = _ref2.r;

    return [{ x: cx, y: cy - r, moveTo: true }, { x: cx, y: cy + r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }, { x: cx, y: cy - r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }]
  };

  var getPointsFromEllipse = function getPointsFromEllipse (_ref3) {
    var cx = _ref3.cx,
      cy = _ref3.cy,
      rx = _ref3.rx,
      ry = _ref3.ry;

    return [{ x: cx, y: cy - ry, moveTo: true }, { x: cx, y: cy + ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } }, { x: cx, y: cy - ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } }]
  };

  var getPointsFromLine = function getPointsFromLine (_ref4) {
    var x1 = _ref4.x1,
      x2 = _ref4.x2,
      y1 = _ref4.y1,
      y2 = _ref4.y2;

    return [{ x: x1, y: y1, moveTo: true }, { x: x2, y: y2 }]
  };

  var validCommands = /[MmLlHhVvCcSsQqTtAaZz]/g;

  var commandLengths = {
    A: 7,
    C: 6,
    H: 1,
    L: 2,
    M: 2,
    Q: 4,
    S: 4,
    T: 2,
    V: 1,
    Z: 0
  };

  var relativeCommands = ['a', 'c', 'h', 'l', 'm', 'q', 's', 't', 'v'];

  var isRelative = function isRelative (command) {
    return relativeCommands.indexOf(command) !== -1
  };

  var optionalArcKeys = ['xAxisRotation', 'largeArcFlag', 'sweepFlag'];

  var getCommands = function getCommands (d) {
    return d.match(validCommands)
  };

  var getParams = function getParams (d) {
    return d.split(validCommands).map(function (v) {
      return v.replace(/[0-9]+-/g, function (m) {
        return m.slice(0, -1) + ' -'
      })
    }).map(function (v) {
      return v.replace(/\.[0-9]+/g, function (m) {
        return m + ' '
      })
    }).map(function (v) {
      return v.trim()
    }).filter(function (v) {
      return v.length > 0
    }).map(function (v) {
      return v.split(/[ ,]+/).map(parseFloat).filter(function (n) {
        return !isNaN(n)
      })
    })
  };

  var getPointsFromPath = function getPointsFromPath (_ref5) {
    var d = _ref5.d;

    var commands = getCommands(d);
    var params = getParams(d);

    var points = [];

    var moveTo = void 0;

    for (var i = 0, l = commands.length; i < l; i++) {
      var command = commands[i];
      var upperCaseCommand = command.toUpperCase();
      var commandLength = commandLengths[upperCaseCommand];
      var relative = isRelative(command);
      var prevPoint = i === 0 ? null : points[points.length - 1];

      if (commandLength > 0) {
        var commandParams = params.shift();
        var iterations = commandParams.length / commandLength;

        for (var j = 0; j < iterations; j++) {
          switch (upperCaseCommand) {
            case 'M':
              var x = (relative && prevPoint ? prevPoint.x : 0) + commandParams.shift();
              var y = (relative && prevPoint ? prevPoint.y : 0) + commandParams.shift();

              moveTo = { x: x, y: y };

              points.push({ x: x, y: y, moveTo: true });

              break

            case 'L':
              points.push({
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              break

            case 'H':
              points.push({
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: prevPoint.y
              });

              break

            case 'V':
              points.push({
                x: prevPoint.x,
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              break

            case 'A':
              points.push({
                curve: {
                  type: 'arc',
                  rx: commandParams.shift(),
                  ry: commandParams.shift(),
                  xAxisRotation: commandParams.shift(),
                  largeArcFlag: commandParams.shift(),
                  sweepFlag: commandParams.shift()
                },
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError;

              try {
                for (var _iterator = optionalArcKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var k = _step.value;

                  if (points[points.length - 1]['curve'][k] === 0) {
                    delete points[points.length - 1]['curve'][k];
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError
                  }
                }
              }

              break

            case 'C':
              points.push({
                curve: {
                  type: 'cubic',
                  x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                  y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                  x2: (relative ? prevPoint.x : 0) + commandParams.shift(),
                  y2: (relative ? prevPoint.y : 0) + commandParams.shift()
                },
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              break

            case 'S':
              var sx2 = (relative ? prevPoint.x : 0) + commandParams.shift();
              var sy2 = (relative ? prevPoint.y : 0) + commandParams.shift();
              var sx = (relative ? prevPoint.x : 0) + commandParams.shift();
              var sy = (relative ? prevPoint.y : 0) + commandParams.shift();

              var diff = {};

              var sx1 = void 0;
              var sy1 = void 0;

              if (prevPoint.curve && prevPoint.curve.type === 'cubic') {
                diff.x = Math.abs(prevPoint.x - prevPoint.curve.x2);
                diff.y = Math.abs(prevPoint.y - prevPoint.curve.y2);
                sx1 = prevPoint.x < prevPoint.curve.x2 ? prevPoint.x - diff.x : prevPoint.x + diff.x;
                sy1 = prevPoint.y < prevPoint.curve.y2 ? prevPoint.y - diff.y : prevPoint.y + diff.y;
              } else {
                diff.x = Math.abs(sx - sx2);
                diff.y = Math.abs(sy - sy2);
                sx1 = prevPoint.x;
                sy1 = prevPoint.y;
              }

              points.push({ curve: { type: 'cubic', x1: sx1, y1: sy1, x2: sx2, y2: sy2 }, x: sx, y: sy });

              break

            case 'Q':
              points.push({
                curve: {
                  type: 'quadratic',
                  x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                  y1: (relative ? prevPoint.y : 0) + commandParams.shift()
                },
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              break

            case 'T':
              var tx = (relative ? prevPoint.x : 0) + commandParams.shift();
              var ty = (relative ? prevPoint.y : 0) + commandParams.shift();

              var tx1 = void 0;
              var ty1 = void 0;

              if (prevPoint.curve && prevPoint.curve.type === 'quadratic') {
                var _diff = {
                  x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                  y: Math.abs(prevPoint.y - prevPoint.curve.y1)
                };

                tx1 = prevPoint.x < prevPoint.curve.x1 ? prevPoint.x - _diff.x : prevPoint.x + _diff.x;
                ty1 = prevPoint.y < prevPoint.curve.y1 ? prevPoint.y - _diff.y : prevPoint.y + _diff.y;
              } else {
                tx1 = prevPoint.x;
                ty1 = prevPoint.y;
              }

              points.push({ curve: { type: 'quadratic', x1: tx1, y1: ty1 }, x: tx, y: ty });

              break
          }
        }
      } else {
        if (prevPoint.x !== moveTo.x || prevPoint.y !== moveTo.y) {
          points.push({ x: moveTo.x, y: moveTo.y });
        }
      }
    }

    return points
  };

  var getPointsFromPolygon = function getPointsFromPolygon (_ref6) {
    var points = _ref6.points;

    return getPointsFromPoints({ closed: true, points: points })
  };

  var getPointsFromPolyline = function getPointsFromPolyline (_ref7) {
    var points = _ref7.points;

    return getPointsFromPoints({ closed: false, points: points })
  };

  var getPointsFromPoints = function getPointsFromPoints (_ref8) {
    var closed = _ref8.closed,
      points = _ref8.points;

    var numbers = points.split(/[\s,]+/).map(function (n) {
      return parseFloat(n)
    });

    var p = numbers.reduce(function (arr, point, i) {
      if (i % 2 === 0) {
        arr.push({ x: point });
      } else {
        arr[(i - 1) / 2].y = point;
      }

      return arr
    }, []);

    if (closed) {
  	var firstPoint = p[0];
      p.push({x:firstPoint.x,y:firstPoint.y});
    }

    p[0].moveTo = true;

    return p
  };

  var getPointsFromRect = function getPointsFromRect (_ref9) {
    var height = _ref9.height,
      rx = _ref9.rx,
      ry = _ref9.ry,
      width = _ref9.width,
      x = _ref9.x,
      y = _ref9.y;

    if (rx || ry) {
      return getPointsFromRectWithCornerRadius({
        height: height,
        rx: rx || ry,
        ry: ry || rx,
        width: width,
        x: x,
        y: y
      })
    }

    return getPointsFromBasicRect({ height: height, width: width, x: x, y: y })
  };

  var getPointsFromBasicRect = function getPointsFromBasicRect (_ref10) {
    var height = _ref10.height,
      width = _ref10.width,
      x = _ref10.x,
      y = _ref10.y;

    return [{ x: x, y: y, moveTo: true }, { x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y + height }, { x: x, y: y }]
  };

  var getPointsFromRectWithCornerRadius = function getPointsFromRectWithCornerRadius (_ref11) {
    var height = _ref11.height,
      rx = _ref11.rx,
      ry = _ref11.ry,
      width = _ref11.width,
      x = _ref11.x,
      y = _ref11.y;

    var curve = { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 };

    return [{ x: x + rx, y: y, moveTo: true }, { x: x + width - rx, y: y }, { x: x + width, y: y + ry, curve: curve }, { x: x + width, y: y + height - ry }, { x: x + width - rx, y: y + height, curve: curve }, { x: x + rx, y: y + height }, { x: x, y: y + height - ry, curve: curve }, { x: x, y: y + ry }, { x: x + rx, y: y, curve: curve }]
  };

  var getPointsFromG = function getPointsFromG (_ref12) {
    var shapes = _ref12.shapes;
    return shapes.map(function (s) {
      return toPoints(s)
    })
  };

  // AntiGrain approximate bezier curve algorithm
  // ported by @mattdesl
  // thank you
  // you're amazing

  var vec2 = function (x, y) {
  	return {
  		x: x,
  		y: y
  	}
  };

  var recursionLimit = 20;
  	var fltEpsilon = 1.19209290e-7;
  	var pathDistEpsilon = 1.0;

  	var curveAngleToleranceEpsilon = 0.01;
  	var mAngleTolerance = 0;
  	var mCuspLimit = 0;

  	/// /// Based on:
  	/// /// https://github.com/pelson/antigrain/blob/master/agg-2.4/src/agg_curves.cpp

  function CubicBezierApprox(x1, y1, x2, y2, x3, y3, x4, y4, points, distanceTolerance) {
  	if (!points) {
  		points = [];
  	}
  	points.push(vec2(x1, y1));
  	cubicApproxRecursive(x1, y1, x2, y2, x3, y3, x4, y4, points, distanceTolerance || pathDistEpsilon, 0);
  	points.push(vec2(x4, y4));
  	return points
  }

  function QuadraticBezierApprox(x1, y1, x2, y2, x3, y3, points, distanceTolerance) {
  	if (!points) {
  		points = [];
  	}
  	points.push(vec2(x1, y1));
  	quadraticApproxRecursive(x1, y1, x2, y2, x3, y3, points, distanceTolerance || pathDistEpsilon, 0);
  	points.push(vec2(x4, y4));
  	return points
  }

  function cubicApproxRecursive(x1, y1, x2, y2, x3, y3, x4, y4, points, distanceTolerance, level) {
  	if (level > recursionLimit) {
  		return
  	}

  	var pi = Math.PI;

  		// Calculate all the mid-points of the line segments
  		// ----------------------
  		var x12 = (x1 + x2) / 2;
  		var y12 = (y1 + y2) / 2;
  		var x23 = (x2 + x3) / 2;
  		var y23 = (y2 + y3) / 2;
  		var x34 = (x3 + x4) / 2;
  		var y34 = (y3 + y4) / 2;
  		var x123 = (x12 + x23) / 2;
  		var y123 = (y12 + y23) / 2;
  		var x234 = (x23 + x34) / 2;
  		var y234 = (y23 + y34) / 2;
  		var x1234 = (x123 + x234) / 2;
  		var y1234 = (y123 + y234) / 2;

  		if (level > 0) { // Enforce subdivision first time
  			// Try to approximate the full cubic curve by a single straight line
  			// ------------------
  			var dx = x4 - x1;
  				var dy = y4 - y1;

  				var d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx);
  				var d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx);

  				var da1,
  			da2;

  			if (d2 > fltEpsilon && d3 > fltEpsilon) {
  				// Regular care
  				// -----------------
  				if ((d2 + d3) * (d2 + d3) <= distanceTolerance * (dx * dx + dy * dy)) {
  					// If the curvature doesn't exceed the distanceTolerance value
  					// we tend to finish subdivisions.
  					// ----------------------
  					if (mAngleTolerance < curveAngleToleranceEpsilon) {
  						points.push(vec2(x1234, y1234));
  						return
  					}

  					// Angle & Cusp Condition
  					// ----------------------
  					var a23 = Math.atan2(y3 - y2, x3 - x2);
  						da1 = Math.abs(a23 - Math.atan2(y2 - y1, x2 - x1));
  						da2 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - a23);
  						if (da1 >= pi) {
  							da1 = 2 * pi - da1;
  						}
  						if (da2 >= pi) {
  							da2 = 2 * pi - da2;
  						}

  						if (da1 + da2 < mAngleTolerance) {
  							// Finally we can stop the recursion
  							// ----------------------
  							points.push(vec2(x1234, y1234));
  							return
  						}

  						if (mCuspLimit !== 0.0) {
  							if (da1 > mCuspLimit) {
  								points.push(vec2(x2, y2));
  								return
  							}

  							if (da2 > mCuspLimit) {
  								points.push(vec2(x3, y3));
  								return
  							}
  						}
  				}
  			} else {
  				if (d2 > fltEpsilon) {
  					// p1,p3,p4 are collinear, p2 is considerable
  					// ----------------------
  					if (d2 * d2 <= distanceTolerance * (dx * dx + dy * dy)) {
  						if (mAngleTolerance < curveAngleToleranceEpsilon) {
  							points.push(vec2(x1234, y1234));
  							return
  						}

  						// Angle Condition
  						// ----------------------
  						da1 = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
  							if (da1 >= pi) {
  								da1 = 2 * pi - da1;
  							}

  							if (da1 < mAngleTolerance) {
  								points.push(vec2(x2, y2));
  								points.push(vec2(x3, y3));
  								return
  							}

  							if (mCuspLimit !== 0.0) {
  								if (da1 > mCuspLimit) {
  									points.push(vec2(x2, y2));
  									return
  								}
  							}
  					}
  				} else if (d3 > fltEpsilon) {
  					// p1,p2,p4 are collinear, p3 is considerable
  					// ----------------------
  					if (d3 * d3 <= distanceTolerance * (dx * dx + dy * dy)) {
  						if (mAngleTolerance < curveAngleToleranceEpsilon) {
  							points.push(vec2(x1234, y1234));
  							return
  						}

  						// Angle Condition
  						// ----------------------
  						da1 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y3 - y2, x3 - x2));
  							if (da1 >= pi) {
  								da1 = 2 * pi - da1;
  							}

  							if (da1 < mAngleTolerance) {
  								points.push(vec2(x2, y2));
  								points.push(vec2(x3, y3));
  								return
  							}

  							if (mCuspLimit !== 0.0) {
  								if (da1 > mCuspLimit) {
  									points.push(vec2(x3, y3));
  									return
  								}
  							}
  					}
  				} else {
  					// Collinear case
  					// -----------------
  					dx = x1234 - (x1 + x4) / 2;
  						dy = y1234 - (y1 + y4) / 2;
  						if (dx * dx + dy * dy <= distanceTolerance) {
  							points.push(vec2(x1234, y1234));
  							return
  						}
  				}
  			}
  		}

  		// Continue subdivision
  		// ----------------------
  		cubicApproxRecursive(x1, y1, x12, y12, x123, y123, x1234, y1234, points, distanceTolerance, level + 1);
  		cubicApproxRecursive(x1234, y1234, x234, y234, x34, y34, x4, y4, points, distanceTolerance, level + 1);
  }

  function quadraticApproxRecursive(x1, y1, x2, y2, x3, y3, points, distanceTolerance, level) {
  	if (level > RECURSION_LIMIT) {
  		return
  	}

  	var pi = Math.PI;

  		// Calculate all the mid-points of the line segments
  		// ----------------------
  		var x12 = (x1 + x2) / 2;
  		var y12 = (y1 + y2) / 2;
  		var x23 = (x2 + x3) / 2;
  		var y23 = (y2 + y3) / 2;
  		var x123 = (x12 + x23) / 2;
  		var y123 = (y12 + y23) / 2;

  		var dx = x3 - x1;
  		var dy = y3 - y1;
  		var d = Math.abs((x2 - x3) * dy - (y2 - y3) * dx);

  		if (d > FLT_EPSILON) {
  			// Regular care
  			// -----------------
  			if (d * d <= distanceTolerance * (dx * dx + dy * dy)) {
  				// If the curvature doesn't exceed the distance_tolerance value
  				// we tend to finish subdivisions.
  				// ----------------------
  				if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
  					points.push(vec2(x123, y123));
  					return
  				}

  				// Angle & Cusp Condition
  				// ----------------------
  				var da = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
  					if (da >= pi) {
  						da = 2 * pi - da;
  					}

  					if (da < m_angle_tolerance) {
  						// Finally we can stop the recursion
  						// ----------------------
  						points.push(vec2(x123, y123));
  						return
  					}
  			}
  		} else {
  			// Collinear case
  			// -----------------
  			dx = x123 - (x1 + x3) / 2;
  				dy = y123 - (y1 + y3) / 2;
  				if (dx * dx + dy * dy <= distanceTolerance) {
  					points.push(vec2(x123, y123));
  					return
  				}
  		}

  		// Continue subdivision
  		// ----------------------
  		quadraticApproxRecursive(x1, y1, x12, y12, x123, y123, points, distanceTolerance, level + 1);
  		quadraticApproxRecursive(x123, y123, x23, y23, x3, y3, points, distanceTolerance, level + 1);
  }

  // Mod by @dalisoft


  function ApproximateCurves(points) {
  	if (typeof points === 'string') {
  		points = toPoints({
  				type: "path",
  				d: points
  			});
  	} else if (typeof points === 'object' && points.type) {
  		points = toPoints(points);
  	}
  	var i = 0,
  	p,
  	p0,
  	type,
  	x1,
  	y1,
  	x2,
  	y2,
  	_straightLines;
  	while (i < points.length) {
  		p = points[i];
  			if (p.curve) {
  				p0 = points[i - 1];
  					type = p.curve.type;
  					x1 = p.curve.x1;
  					y1 = p.curve.y1;
  					x2 = p.curve.x2;
  					y2 = p.curve.y2;
  					if (type === 'arc') {
  						var curves = arcToBezier$1({
  								px: p0.x,
  								py: p0.y,
  								cx: p.x,
  								cy: p.y,
  								rx: p.curve.rx,
  								ry: p.curve.ry,
  								xAxisRotation: p.curve.xAxisRotation,
  								largeArcFlag: p.curve.largeArcFlag,
  								sweepFlag: p.curve.sweepFlag
  							});

  							points.splice(i, 1);
  							for (var i2 = 0, len = curves.length; i2 < len; i2++) {
  								var _ref = curves[i],
  								x1 = _ref.x1,
  								y1 = _ref.y1,
  								x2 = _ref.x2,
  								y2 = _ref.y2,
  								x = _ref.x,
  								y = _ref.y;

  									points.splice(i + i2, 0, {
  										x: x,
  										y: y,
  										curve: {
  											type: 'cubic',
  											x1: x1,
  											y1: y1,
  											x2: x2,
  											y2: y2
  										}
  									});
  							}
  							i--;
  					} else if (type === 'cubic') {
  						points.splice(i, 1);
  						_straightLines = CubicBezierApprox(p0.x, p0.y, x1, y1, x2, y2, p.x, p.y);
  							for (var i2 = 0, len = _straightLines.length; i2 < len; i2++) {
  								points.splice(i + i2, 0, _straightLines[i2]);
  							}
  					} else if (type === 'quadratic') {
  						points.splice(i, 1);
  						_straightLines = QuadraticBezierApprox(p0.x, p0.y, x1, y1, p.x, p.y);
  							for (var i2 = 0, len = _straightLines.length; i2 < len; i2++) {
  								points.splice(i + i2, 0, _straightLines[i2]);
  							}
  					}
  			} else {
  				i++;
  			}
  	}
  	return points
  }

  var autoNormalisePoints = function (fromShape, toShape, ref) {
    if ( ref === void 0 ) ref = {};
    var map = ref.map;
    var order = ref.order;
    var bboxCenter = ref.bboxCenter;
    var approximate = ref.approximate;
    var useAsArray = ref.useAsArray;
    var moveIndex$$1 = ref.moveIndex;
    var reverse$$1 = ref.reverse;
    var closerBound = ref.closerBound;

    var fromShapeSubPathsCount = countSubPath(fromShape);
    var toShapeSubPathsCount = countSubPath(toShape);
    if (fromShapeSubPathsCount === 1 && toShapeSubPathsCount === 1) {
      var diff = toShape.length - fromShape.length;
      if (typeof moveIndex$$1 === 'number' && moveIndex$$1) {
        fromShape = moveIndex(fromShape, moveIndex$$1);
      }
      if (reverse$$1 !== undefined) {
        fromShape = reverse(fromShape);
      }
      if (diff > 0) {
        fromShape = add(fromShape, toShape.length);
      } else if (diff < 0) {
        toShape = add(toShape, fromShape.length);
      }
      if (map) {
        fromShape = map(fromShape, toShape, 0, diff, true);
      }
      fromShape = autoCurvePoint(fromShape, toShape);
      toShape = autoCurvePoint(toShape, fromShape);
      return [fromShape, toShape]
    } else {
      var fromShapeSubPaths = splitSubPath(fromShape);
      var toShapeSubPaths = splitSubPath(toShape);

      if (order) {
        if (order.startOrder) {
          fromShapeSubPaths.sort(mapList.get(order.startOrder));
        } else if (order.endOrder) {
          toShapeSubPaths.sort(mapList.get(order.endOrder));
        } else {
          fromShapeSubPaths.sort(mapList.get(order));
          toShapeSubPaths.sort(mapList.get(order));
        }
      }
      var largestShapeSubPathsMap = fromShapeSubPaths.length > toShapeSubPaths.length ? fromShapeSubPaths
        : toShapeSubPaths;

      // Permutes between multi-path shapes
      if (closerBound && fromShapeSubPaths.length > 1) {
        var i = 0;
        var minDistance = Infinity;
        var skipInfinity = false;
        while (i < fromShapeSubPaths.length) {
          if (fromShapeSubPaths[i]) {
            var i2 = 0;
            while (i2 < toShapeSubPaths.length) {
              var currentDistance = distance(boundingBox(fromShapeSubPaths[i])
                .center, boundingBox(toShapeSubPaths[i2])
                .center);
              if (currentDistance < minDistance) {
                if (!isFinite(minDistance)) {
                  skipInfinity = true;
                }
                if (skipInfinity && i !== i2 && fromShapeSubPaths[i2]) {
                  var spliced = fromShapeSubPaths.splice(i2, 1);
                  fromShapeSubPaths.splice(i, 0, spliced[0]);
                }
                minDistance = currentDistance;
              }
              i2++;
            }
          }
          i++;
        }
      }

      largestShapeSubPathsMap.map(function (d, i) {
        var fromSubPath = fromShapeSubPaths[i];
        var toSubPath = toShapeSubPaths[i];
        var prev;
        var diff;
        var x;
        var y;

        if (fromSubPath && !toSubPath) {
          if (typeof moveIndex$$1 === 'number' && moveIndex$$1) {
            fromSubPath = moveIndex(fromSubPath, moveIndex$$1);
          }
          if (reverse$$1 !== undefined) {
            fromSubPath = reverse(fromSubPath);
          }
          fromSubPath = cubify(remove(fromSubPath));
          if (bboxCenter) {
            var findCloser = findNearestIndex(toShape, boundingBox(fromSubPath)
              .center);
            x = findCloser.x;
            y = findCloser.y;
          } else {
            prev = toShapeSubPaths[i - 1];
            prev = prev[prev.length - 1];
            x = prev.x;
            y = prev.y;
          }
          toSubPath = [{
            x: x,
            y: y,
            moveTo: true
          }, {
            x: x,
            y: y
          }];
          for (var ii = 0, len = fromSubPath.length; ii < len; ii++) {
            if (toSubPath[ii] === undefined) {
              toSubPath[ii] = {
                x: x,
                y: y
              };
            }
          }
        } else if (toSubPath && !fromSubPath) {
          toSubPath = cubify(remove(toSubPath));
          if (bboxCenter) {
            var findCloser$1 = findNearestIndex(fromShape, boundingBox(toSubPath)
              .center);
            x = findCloser$1.x;
            y = findCloser$1.y;
          } else {
            prev = fromShapeSubPaths[i - 1];
            prev = prev[prev.length - 1];
            x = prev.x;
            y = prev.y;
          }
          fromSubPath = [{
            x: x,
            y: y,
            moveTo: true
          }, {
            x: x,
            y: y
          }];
          for (var ii$1 = 0, len$1 = toSubPath.length; ii$1 < len$1; ii$1++) {
            if (fromSubPath[ii$1] === undefined) {
              fromSubPath[ii$1] = {
                x: x,
                y: y
              };
            }
          }
        } else if (fromSubPath && toSubPath) {
          if (typeof moveIndex$$1 === 'number' && moveIndex$$1) {
            fromSubPath = moveIndex(fromSubPath, moveIndex$$1);
          }
          if (reverse$$1 !== undefined) {
            fromSubPath = reverse(fromSubPath);
          }
          fromSubPath = cubify(remove(fromSubPath));
          toSubPath = cubify(remove(toSubPath));
          diff = toSubPath.length - fromSubPath.length;
          if (diff > 0) {
            fromSubPath = add(fromSubPath, toSubPath.length);
          } else if (diff < 0) {
            toSubPath = add(toSubPath, fromSubPath.length);
          }
        }

        if (map) {
          fromSubPath = map(fromSubPath, toSubPath, i, diff, false);
        }

        fromSubPath = autoCurvePoint(fromSubPath, toSubPath);
        toSubPath = autoCurvePoint(toSubPath, fromSubPath);

        if (approximate) {
          fromSubPath = remove(ApproximateCurves(fromSubPath));
          toSubPath = remove(ApproximateCurves(toSubPath));
          if (useAsArray) {
            fromSubPath = fromSubPath.map(function (p) { return [p.x, p.y]; });
            toSubPath = toSubPath.map(function (p) { return [p.x, p.y]; });
          }
        }
        fromShapeSubPaths[i] = fromSubPath;
        toShapeSubPaths[i] = toSubPath;
      });

      return [useAsArray ? fromShapeSubPaths : joinSubPath(fromShapeSubPaths), useAsArray ? toShapeSubPaths : joinSubPath(toShapeSubPaths)]
    }
  };

  var autoNormalise = function (fromShape, toShape, param) { return applyFuncToShapes(autoNormalisePoints, fromShape, toShape, param); };

  var autoReversePoints = function (fromShape, toShape) {
    var fromShapeArea = area(fromShape);
    var toShapeArea = area(toShape);
    if ((fromShapeArea > 0 && toShapeArea < 0) || (toShapeArea > 0 && fromShapeArea < 0)) {
      fromShape = reverse(fromShape);
    }
    return fromShape
  };

  var autoReverse = function (fromShape, toShape) { return applyFuncToShapes(autoReversePoints, fromShape, toShape); };

  var autoFixPoints = function (fromShape, toShape, param) {
    if ( param === void 0 ) param = {};

    fromShape = autoReverse(fromShape, toShape);

    if (!param || typeof param !== 'object') {
      return new Error("Invalid parametr of config")
    }
    param.map = function (fromSubPath, toSubPath, index) {
      fromSubPath = autoReverse(fromSubPath, toSubPath);
      fromSubPath = autoIndex(fromSubPath, toSubPath);
      return fromSubPath
    };
    if (param.bboxCenter === undefined) {
      param.bboxCenter = true;
    }

    return autoNormalise(fromShape, toShape, param)
  };

  var autoFix = function (fromShape, toShape, param) { return applyFuncToShapes(autoFixPoints, fromShape, toShape, param); };

  /** global: x1 */

  var _extends = Object.assign || function (target) {
  var arguments$1 = arguments;
   for (var i = 1; i < arguments.length; i++) { var source = arguments$1[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) { continue; } if (!Object.prototype.hasOwnProperty.call(obj, i)) { continue; } target[i] = obj[i]; } return target; }

  var toPoints$1 = function toPoints(_ref) {
    var type = _ref.type,
        props = _objectWithoutProperties(_ref, ['type']);

    switch (type) {
      case 'circle':
        return getPointsFromCircle$1(props);
      case 'ellipse':
        return getPointsFromEllipse$1(props);
      case 'line':
        return getPointsFromLine$1(props);
      case 'path':
        return getPointsFromPath$1(props);
      case 'polygon':
        return getPointsFromPolygon$1(props);
      case 'polyline':
        return getPointsFromPolyline$1(props);
      case 'rect':
        return getPointsFromRect$1(props);
      case 'g':
        return getPointsFromG$1(props);
      default:
        throw new Error('Not a valid shape type');
    }
  };

  var getPointsFromCircle$1 = function getPointsFromCircle(_ref2) {
    var cx = _ref2.cx,
        cy = _ref2.cy,
        r = _ref2.r;

    return [{ x: cx, y: cy - r, moveTo: true }, { x: cx, y: cy + r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }, { x: cx, y: cy - r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }];
  };

  var getPointsFromEllipse$1 = function getPointsFromEllipse(_ref3) {
    var cx = _ref3.cx,
        cy = _ref3.cy,
        rx = _ref3.rx,
        ry = _ref3.ry;

    return [{ x: cx, y: cy - ry, moveTo: true }, { x: cx, y: cy + ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } }, { x: cx, y: cy - ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } }];
  };

  var getPointsFromLine$1 = function getPointsFromLine(_ref4) {
    var x1 = _ref4.x1,
        x2 = _ref4.x2,
        y1 = _ref4.y1,
        y2 = _ref4.y2;

    return [{ x: x1, y: y1, moveTo: true }, { x: x2, y: y2 }];
  };

  var validCommands$1 = /[MmLlHhVvCcSsQqTtAaZz]/g;

  var commandLengths$1 = {
    A: 7,
    C: 6,
    H: 1,
    L: 2,
    M: 2,
    Q: 4,
    S: 4,
    T: 2,
    V: 1,
    Z: 0
  };

  var relativeCommands$1 = ['a', 'c', 'h', 'l', 'm', 'q', 's', 't', 'v'];

  var isRelative$1 = function isRelative(command) {
    return relativeCommands$1.indexOf(command) !== -1;
  };

  var optionalArcKeys$1 = ['xAxisRotation', 'largeArcFlag', 'sweepFlag'];

  var getCommands$1 = function getCommands(d) {
    return d.match(validCommands$1);
  };

  var getParams$1 = function getParams(d) {
    return d.split(validCommands$1).map(function (v) {
      return v.replace(/[0-9]+-/g, function (m) {
        return m.slice(0, -1) + ' -';
      });
    }).map(function (v) {
      return v.replace(/\.[0-9]+/g, function (m) {
        return m + ' ';
      });
    }).map(function (v) {
      return v.trim();
    }).filter(function (v) {
      return v.length > 0;
    }).map(function (v) {
      return v.split(/[ ,]+/).map(parseFloat).filter(function (n) {
        return !isNaN(n);
      });
    });
  };

  var getPointsFromPath$1 = function getPointsFromPath(_ref5) {
    var d = _ref5.d;

    var commands = getCommands$1(d);
    var params = getParams$1(d);

    var points = [];

    var moveTo = void 0;

    for (var i = 0, l = commands.length; i < l; i++) {
      var command = commands[i];
      var upperCaseCommand = command.toUpperCase();
      var commandLength = commandLengths$1[upperCaseCommand];
      var relative = isRelative$1(command);

      if (commandLength > 0) {
        var commandParams = params.shift();
        var iterations = commandParams.length / commandLength;

        for (var j = 0; j < iterations; j++) {
          var prevPoint = points[points.length - 1] || { x: 0, y: 0 };

          switch (upperCaseCommand) {
            case 'M':
              var x = (relative ? prevPoint.x : 0) + commandParams.shift();
              var y = (relative ? prevPoint.y : 0) + commandParams.shift();

              if (j === 0) {
                moveTo = { x: x, y: y };
                points.push({ x: x, y: y, moveTo: true });
              } else {
                points.push({ x: x, y: y });
              }

              break;

            case 'L':
              points.push({
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              break;

            case 'H':
              points.push({
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: prevPoint.y
              });

              break;

            case 'V':
              points.push({
                x: prevPoint.x,
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              break;

            case 'A':
              points.push({
                curve: {
                  type: 'arc',
                  rx: commandParams.shift(),
                  ry: commandParams.shift(),
                  xAxisRotation: commandParams.shift(),
                  largeArcFlag: commandParams.shift(),
                  sweepFlag: commandParams.shift()
                },
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = optionalArcKeys$1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var k = _step.value;

                  if (points[points.length - 1]['curve'][k] === 0) {
                    delete points[points.length - 1]['curve'][k];
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              break;

            case 'C':
              points.push({
                curve: {
                  type: 'cubic',
                  x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                  y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                  x2: (relative ? prevPoint.x : 0) + commandParams.shift(),
                  y2: (relative ? prevPoint.y : 0) + commandParams.shift()
                },
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              break;

            case 'S':
              var sx2 = (relative ? prevPoint.x : 0) + commandParams.shift();
              var sy2 = (relative ? prevPoint.y : 0) + commandParams.shift();
              var sx = (relative ? prevPoint.x : 0) + commandParams.shift();
              var sy = (relative ? prevPoint.y : 0) + commandParams.shift();

              var diff = {};

              var sx1 = void 0;
              var sy1 = void 0;

              if (prevPoint.curve && prevPoint.curve.type === 'cubic') {
                diff.x = Math.abs(prevPoint.x - prevPoint.curve.x2);
                diff.y = Math.abs(prevPoint.y - prevPoint.curve.y2);
                sx1 = prevPoint.x < prevPoint.curve.x2 ? prevPoint.x - diff.x : prevPoint.x + diff.x;
                sy1 = prevPoint.y < prevPoint.curve.y2 ? prevPoint.y - diff.y : prevPoint.y + diff.y;
              } else {
                diff.x = Math.abs(sx - sx2);
                diff.y = Math.abs(sy - sy2);
                sx1 = prevPoint.x;
                sy1 = prevPoint.y;
              }

              points.push({ curve: { type: 'cubic', x1: sx1, y1: sy1, x2: sx2, y2: sy2 }, x: sx, y: sy });

              break;

            case 'Q':
              points.push({
                curve: {
                  type: 'quadratic',
                  x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                  y1: (relative ? prevPoint.y : 0) + commandParams.shift()
                },
                x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y: (relative ? prevPoint.y : 0) + commandParams.shift()
              });

              break;

            case 'T':
              var tx = (relative ? prevPoint.x : 0) + commandParams.shift();
              var ty = (relative ? prevPoint.y : 0) + commandParams.shift();

              var tx1 = void 0;
              var ty1 = void 0;

              if (prevPoint.curve && prevPoint.curve.type === 'quadratic') {
                var _diff = {
                  x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                  y: Math.abs(prevPoint.y - prevPoint.curve.y1)
                };

                tx1 = prevPoint.x < prevPoint.curve.x1 ? prevPoint.x - _diff.x : prevPoint.x + _diff.x;
                ty1 = prevPoint.y < prevPoint.curve.y1 ? prevPoint.y - _diff.y : prevPoint.y + _diff.y;
              } else {
                tx1 = prevPoint.x;
                ty1 = prevPoint.y;
              }

              points.push({ curve: { type: 'quadratic', x1: tx1, y1: ty1 }, x: tx, y: ty });

              break;
          }
        }
      } else {
        var _prevPoint = points[points.length - 1] || { x: 0, y: 0 };

        if (_prevPoint.x !== moveTo.x || _prevPoint.y !== moveTo.y) {
          points.push({ x: moveTo.x, y: moveTo.y });
        }
      }
    }

    return points;
  };

  var getPointsFromPolygon$1 = function getPointsFromPolygon(_ref6) {
    var points = _ref6.points;

    return getPointsFromPoints$1({ closed: true, points: points });
  };

  var getPointsFromPolyline$1 = function getPointsFromPolyline(_ref7) {
    var points = _ref7.points;

    return getPointsFromPoints$1({ closed: false, points: points });
  };

  var getPointsFromPoints$1 = function getPointsFromPoints(_ref8) {
    var closed = _ref8.closed,
        points = _ref8.points;

    var numbers = points.split(/[\s,]+/).map(function (n) {
      return parseFloat(n);
    });

    var p = numbers.reduce(function (arr, point, i) {
      if (i % 2 === 0) {
        arr.push({ x: point });
      } else {
        arr[(i - 1) / 2].y = point;
      }

      return arr;
    }, []);

    if (closed) {
      p.push(_extends({}, p[0]));
    }

    p[0].moveTo = true;

    return p;
  };

  var getPointsFromRect$1 = function getPointsFromRect(_ref9) {
    var height = _ref9.height,
        rx = _ref9.rx,
        ry = _ref9.ry,
        width = _ref9.width,
        x = _ref9.x,
        y = _ref9.y;

    if (rx || ry) {
      return getPointsFromRectWithCornerRadius$1({
        height: height,
        rx: rx || ry,
        ry: ry || rx,
        width: width,
        x: x,
        y: y
      });
    }

    return getPointsFromBasicRect$1({ height: height, width: width, x: x, y: y });
  };

  var getPointsFromBasicRect$1 = function getPointsFromBasicRect(_ref10) {
    var height = _ref10.height,
        width = _ref10.width,
        x = _ref10.x,
        y = _ref10.y;

    return [{ x: x, y: y, moveTo: true }, { x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y + height }, { x: x, y: y }];
  };

  var getPointsFromRectWithCornerRadius$1 = function getPointsFromRectWithCornerRadius(_ref11) {
    var height = _ref11.height,
        rx = _ref11.rx,
        ry = _ref11.ry,
        width = _ref11.width,
        x = _ref11.x,
        y = _ref11.y;

    var curve = { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 };

    return [{ x: x + rx, y: y, moveTo: true }, { x: x + width - rx, y: y }, { x: x + width, y: y + ry, curve: curve }, { x: x + width, y: y + height - ry }, { x: x + width - rx, y: y + height, curve: curve }, { x: x + rx, y: y + height }, { x: x, y: y + height - ry, curve: curve }, { x: x, y: y + ry }, { x: x + rx, y: y, curve: curve }];
  };

  var getPointsFromG$1 = function getPointsFromG(_ref12) {
    var shapes = _ref12.shapes;
    return shapes.map(function (s) {
      return toPoints$1(s);
    });
  };

  var pointsToD = function pointsToD(p) {
    var d = '';
    var i = 0;
    var firstPoint = void 0;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = p[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var point = _step.value;
        var _point$curve = point.curve,
            curve = _point$curve === undefined ? false : _point$curve,
            moveTo = point.moveTo,
            x = point.x,
            y = point.y;

        var isFirstPoint = i === 0 || moveTo;
        var isLastPoint = i === p.length - 1 || p[i + 1].moveTo;
        var prevPoint = i === 0 ? null : p[i - 1];

        if (isFirstPoint) {
          firstPoint = point;

          if (!isLastPoint) {
            d += 'M' + x + ',' + y;
          }
        } else if (curve) {
          switch (curve.type) {
            case 'arc':
              var _point$curve2 = point.curve,
                  _point$curve2$largeAr = _point$curve2.largeArcFlag,
                  largeArcFlag = _point$curve2$largeAr === undefined ? 0 : _point$curve2$largeAr,
                  rx = _point$curve2.rx,
                  ry = _point$curve2.ry,
                  _point$curve2$sweepFl = _point$curve2.sweepFlag,
                  sweepFlag = _point$curve2$sweepFl === undefined ? 0 : _point$curve2$sweepFl,
                  _point$curve2$xAxisRo = _point$curve2.xAxisRotation,
                  xAxisRotation = _point$curve2$xAxisRo === undefined ? 0 : _point$curve2$xAxisRo;

              d += 'A' + rx + ',' + ry + ',' + xAxisRotation + ',' + largeArcFlag + ',' + sweepFlag + ',' + x + ',' + y;
              break;
            case 'cubic':
              var _point$curve3 = point.curve,
                  cx1 = _point$curve3.x1,
                  cy1 = _point$curve3.y1,
                  cx2 = _point$curve3.x2,
                  cy2 = _point$curve3.y2;

              d += 'C' + cx1 + ',' + cy1 + ',' + cx2 + ',' + cy2 + ',' + x + ',' + y;
              break;
            case 'quadratic':
              var _point$curve4 = point.curve,
                  qx1 = _point$curve4.x1,
                  qy1 = _point$curve4.y1;

              d += 'Q' + qx1 + ',' + qy1 + ',' + x + ',' + y;
              break;
          }

          if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
            d += 'Z';
          }
        } else if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
          d += 'Z';
        } else if (x !== prevPoint.x && y !== prevPoint.y) {
          d += 'L' + x + ',' + y;
        } else if (x !== prevPoint.x) {
          d += 'H' + x;
        } else if (y !== prevPoint.y) {
          d += 'V' + y;
        }

        i++;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return d;
  };

  var toPath = function toPath(s) {
    var isPoints = Array.isArray(s);
    var isGroup = isPoints ? Array.isArray(s[0]) : s.type === 'g';
    var points = isPoints ? s : isGroup ? s.shapes.map(function (shp) {
      return toPoints$1(shp);
    }) : toPoints$1(s);

    if (isGroup) {
      return points.map(function (p) {
        return pointsToD(p);
      });
    }

    return pointsToD(points);
  };

  var style = {
  	fill: 'none',
  	fillOpacity: '1',
  	fillRule: 'nonzero',
  	stroke: 'none',
  	strokeWidth: 'none',
  	strokeDasharray: 'none',
  	strokeDashoffset: '0px',
  	strokeLinecap: 'butt',
  	strokeLinejoin: 'miter',
  	strokeOpacity: '1',
  	opacity: '1',
  	vectorEffect: 'none'
    };
    
    var mainAttr = {
  	id: true,
  	'class': true
    };
    
    var _propTypes = {
  	g: { shapes: true },
  	path: { d: true },
  	polygon: { points: true },
  	polyline: { points: true },
  	rect: {
  	  width: true,
  	  height: true,
  	  x: true,
  	  y: true,
  	  rx: true,
  	  ry: true
  	},
  	circle: {
  	  cx: true,
  	  cy: true,
  	  r: true
  	},
  	ellipse: {
  	  cx: true,
  	  cy: true,
  	  rx: true,
  	  ry: true
  	},
  	line: {
  	  x1: true,
  	  y1: true,
  	  x2: true,
  	  y2: true
  	}
    };
    
    var getProps = function (node, attrs, type, _style, a) {
  	var _attr = {};
  	if (type === 'g') {
  	  var children = [].slice.call(node.children);
  	  _attr.styles = children.map(function (p) { return ({}); });
  	  _attr.attrs = children.map(function (p) { return ({}); });
  	  _attr.shapes = children.map(function (p, i) { return nodeFetch(p, _attr.styles[i], _attr.attrs[i]); });
  	} else {
  	  for (var p in attrs) {
  		var attr = node.getAttribute(p);
  		if (attr) {
  		  _attr[p] = isNaN(+attr) ? attr : +attr;
  		}
  	  }
  	  if (_style) {
  		for (var p$1 in style) {
  		  var attr$1 = node.style[p$1] || node.getAttribute(p$1);
  		  if (attr$1) {
  			_style[p$1] = isNaN(+attr$1) ? attr$1 : +attr$1;
  		  }
  		}
  	  }
  	  if (a) {
  		for (var p$2 in mainAttr) {
  		  var attr$2 = node.getAttribute(p$2);
  		  if (attr$2) {
  			a[p$2] = attr$2;
  		  }
  		}
  	  }
  	}
  	_attr.elem = node;
  	_attr.type = type;
  	return _attr
    };
    
    function nodeFetch (node, style, attr) {
  	var isNode = node !== undefined && node.nodeType !== undefined;
  	var type = isNode && node.tagName.toLowerCase();
  	var propType = isNode && _propTypes[type];
  	return isNode ? getProps(node, propType, type, style, attr) : typeof node === 'string' ? { type: 'path', d: node } : typeof node === 'object' ? node : null
    }

  var interpolatePath = function (ap, bp, t) {
  	var bufferString = '';
  	for (var i = 0, len = ap.length; i < len; i++) {
  	  var ref = ap[i];
  	  var xf = ref.x;
  	  var yf = ref.y;
  	  var curve = ref.curve;
  	  var moveTo = ref.moveTo;
  	  var ref$1 = bp[i];
  	  var xt = ref$1.x;
  	  var yt = ref$1.y;
  	  var curve2 = ref$1.curve;
  	  var x = xf + (xt - xf) * t;
  	  var y = yf + (yt - yf) * t;
  	  if (moveTo) {
  		bufferString += 'M' + x + ',' + y;
  	  } else if (curve && curve2) {
  		var type = curve.type;
  		var x1 = curve.x1;
  		var y1 = curve.y1;
  		var x2 = curve.x2;
  		var y2 = curve.y2;
  		var x3 = curve2.x1;
  		var y3 = curve2.y1;
  		var x4 = curve2.x2;
  		var y4 = curve2.y2;
  		if (type === 'cubic') {
  		  bufferString += 'C' + (x1 + (x3 - x1) * t) + ',' + (y1 + (y3 - y1) * t) + ',' + (x2 + (x4 - x2) * t) + ',' + (y2 + (y4 - y2) * t) + ',' + x + ',' + y;
  		} else if (type === 'quadratic') {
  		  bufferString += 'Q' + (x1 + (x3 - x1) * t) + ',' + (y1 + (y3 - y1) * t) + ',' + x + ',' + y;
  		}
  	  } else {
  		bufferString += 'L' + x + ',' + y;
  	  }
  	}
  	return bufferString
    };

  /**
   * Morph plug-in for ES6 tween
   * (c) 2017, @dalisoft
   * Licensed under MIT-License
   */
  /* global SVGElement, SVGPathElement */
  var isSVGSupport = typeof (window) !== 'undefined' && !!window.SVGElement;
  if (!isSVGSupport) {
    throw new Error('SVG Support requires to work this plug-in')
  }
  var ns = 'http://www.w3.org/2000/svg';
  es6Tween.Plugins.morph = {
    init: function (start, end) {
      var t = this.node;
      var node = t instanceof SVGElement ? t : t.node;
      var style1 = {};
      var attr1 = {};
      var style2 = {};
      var attr2 = {};
      var fixParam = {closerBound:true};
      var shape1 = nodeFetch(start && start.shape ? start.shape : start || node, style1, attr1);
      var shape2 = nodeFetch(end && end.shape ? end.shape : end, style2, attr2);
      if (start.approximate || end.approximate) {
        if (typeof flubber !== 'undefined') {
          fixParam.approximate = true;
          fixParam.useAsArray = true;
          if (start.closerBound === false || !end.closerBound === false) {
            fixParam.closerBound = false;
          }
        } else {
          console.error("ES6 Tween [Plugin::Morph]: The dependecy \"flubber\" requires for working super-fluid animations, please add it to your page.\n        \"flubber\" can transite without our library too, try it...");
        }
      }
      var shapeId1 = toPoints$1(shape1);
      var shapeId2 = toPoints$1(shape2);
      if (start && start.moveIndex) {
        shapeId1 = moveIndex(shapeId1, start.moveIndex);
      }
      if (end && end.moveIndex) {
        shapeId2 = moveIndex(shapeId2, end.moveIndex);
      }
      if (start && start.reverse) {
        shapeId1 = reverse(shapeId1);
      }
      if (end && end.reverse) {
        shapeId2 = reverse(shapeId2);
      }
      var ref = autoFix(shapeId1, shapeId2, fixParam);
      var a = ref[0];
      var b = ref[1];
      if (fixParam.useAsArray) {
        this.__flubber = flubber.interpolateAll(a, b, { single: true });
      }
      if (node instanceof SVGElement && !(node instanceof SVGPathElement)) {
        var path = document.createElementNS(ns, 'path');
        for (var p in attr1) {
          path.setAttribute(p, attr1[p]);
        }
        path.setAttribute('d', this.__flubber ? this.__flubber(0) : toPath(a));
        if (node.parentNode) {
          node.parentNode.replaceChild(path, node);
          node = null;
          node = path;
        }
      }
      this.style = es6Tween.Interpolator(style1, style2);
      this.__fromPoints = a;
      this.__toPoints = b;
      return this
    },
    update: function (currentValue, start, end, v) {
      var d = this.__flubber ? this.__flubber(v) : interpolatePath(this.__fromPoints, this.__toPoints, v);
      var s = this.style(v);
      var node = this.node;
      node.setAttribute('d', d);
      for (var p in s) {
        node.style[p] = s[p];
      }
    }
  };

  var morph_esmodule = es6Tween.Plugins.morph

  return morph_esmodule;

}(TWEEN,flubber));
