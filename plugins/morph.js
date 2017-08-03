/*!
 * @name SVG Shape Morphing Plugin
 * @package es6tween-plugin-morph
 * @version v0.1-beta
 * @license MIT-License
 * @credits: @veltman, https://bl.ocks.org/veltman/4d1413aa5fd3bb5af1a806c146870031
 * @requires: es6-tween core files for running this plugin
 */

(function(factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define(['es6-tween'], factory);
  } else if (typeof module !== "undefined" && module.exports && require('es6-tween') !== undefined) {
    module.exports = factory(require('es6-tween'));
  } else if (typeof exports !== "undefined" && exports.TWEEN && exports.TWEEN) {
    factory(exports.TWEEN);
  } else if (typeof window !== "undefined" && window.TWEEN && window.TWEEN) {
    factory(window.TWEEN);
  }
}(function(TWEEN) {
  "use strict";

  var Plugins = TWEEN.Plugins;
  var Interpolator = TWEEN.Interpolator;

  var comma = ',';

  var rect = function(rectX, rectY, rectX2, rectY2) {
    return 'M' + rectX + comma + rectY + ' L' + rectX2 + comma +
      rectY + ' L' + rectX2 + comma + rectY2 + ' L' + rectX + comma + rectY2 + ' L' + rectX + comma + rectY;
  };
  var line = function(x1, y1, x2, y2) { return 'M' + x1 + comma + y1 + 'L' + x2 + comma + y2; };
  var circle = function(r, cX, cY) {
    var cxr = cX - r;
    var r2 = r * 2;
    var cxr2 = cxr + r2;
    return 'M' + cxr + comma + cY + ' A ' + r + comma + r + ' 0 1,0 ' + cxr2 + comma + cY + ' A ' + r + comma + r +
      ' 0 1,0 ' + (cxr2 - r2) + comma + cY;
  };
  var ellipse = function(rX, rY, cX, cY) {
    var rX2 = rX * 2;
    var cXR = cX - rX;
    var cXR2 = cXR + rX2;
    return 'M' + cXR + comma + cY + ' A ' + rX + comma + rY + ' 0 1,0 ' + cXR2 + comma + cY + ' A ' + rX + comma +
      rY + ' 0 1,0 ' + (cXR2 - rX2) + comma + cY;
  };
  var ns = 'http://www.w3.org/2000/svg';
  var ua = navigator.userAgent;
  var ff = /Firefox/i;
  var getProps = function(node, props) {
    return props.reduce(function(prev, curr) {
      prev.push(node.getAttribute(
        curr));
      return prev;
    }, []);
  };
  var rectProps = ['x', 'y', 'width', 'height'];
  var lineProps = ['x1', 'y1', 'x2', 'y2'];
  var circleProps = ['r', 'cx', 'cy'];
  var ellipseProps = ['rx', 'ry', 'cx', 'cy'];

  function getPathString(shape) {
    var tagName = typeof shape === 'string' ? 'string' : shape.tagName.toLowerCase();
    var pathString = 'M0,0L0,0';
    var props;
    if (tagName === 'string') {
      pathString = shape;
    } else if (tagName === 'rect') {
      props = getProps(shape, rectProps);
      pathString = rect(props[0], props[1], props[2], props[3]);
    } else if (tagName === 'line') {
      props = getProps(shape, lineProps);
      pathString = line(props[0], props[1], props[2], props[3]);
    } else if (tagName === 'circle') {
      props = getProps(shape, circleProps);
      pathString = circle(props[0], props[1], props[2], props[3]);
    } else if (tagName === 'ellipse') {
      props = getProps(shape, ellipseProps);
      pathString = ellipse(props[0], props[1], props[2], props[3]);
    } else if (tagName === 'path') {
      pathString = shape.getAttribute('d');
    } else if (tagName === 'polyline' || tagName === 'polygon') {
      var closePath = tagName === 'polygon' ? 'z' : '';
      pathString = 'M' + shape.getAttribute('points') + closePath;
    }
    return pathString;
  }

  var simulatePath = function(v, max) {
    if (Array.isArray(v)) return v;
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', getPathString(v));

    var leng = path.getTotalLength();
    var dt = 5 / leng;
    var t = -dt;
    var maxT = 1 + dt;
    var shape = [];
    while ((t += dt) < maxT) {
      var point = path.getPointAtLength(t * leng);
      shape.push([point.x, point.y]);
    }
    shape.totalLength = leng;
    return shape;
  }

  function addPoints(ring, numPoints) {

    if (numPoints < 0) return false;

    var desiredLength = ring.length + numPoints,
      step = ring.totalLength / numPoints;

    var i = 0,
      cursor = 0,
      insertAt = step / 2;

    do {

      var a = ring[i],
        b = ring[(i + 1) % ring.length];

      var segment = distanceBetween(a, b);

      if (insertAt <= cursor + segment) {
        ring.splice(i + 1, 0, pointBetween(a, b, (insertAt - cursor) / segment));
        insertAt += step;
        continue;
      }

      cursor += segment;
      i++;

    } while (ring.length < desiredLength);

  }

  function pointBetween(a, b, pct) {

    var point = [
      a[0] + (b[0] - a[0]) * pct,
      a[1] + (b[1] - a[1]) * pct
    ];

    point.added = true;
    return point;

  }

  function distanceBetween(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  }

  function wind(ring, vs) {

    var len = ring.length,
      min = Infinity,
      bestOffset,
      sum;

    for (var offset = 0, len = ring.length; offset < len; offset++) {

      var sum = vs.reduce(function(s, p, i) {
        var distance = distanceBetween(ring[(offset + i) % len], p);
        s += distance * distance;
        return s;
      }, 0);

      if (sum < min) {
        min = sum;
        bestOffset = offset;
      }

    }

    return ring.slice(bestOffset)
      .concat(ring.slice(0, bestOffset));

  }

  var processTarget = function(targ) {
    return !targ ? null : typeof(targ) === "string" ? (targ[0] !== 'M' && targ[0] !== 'm' && isNaN(+targ[0])) ? document.querySelector(targ) :
      /M|m/i.test(targ) ? simulatePath(targ) : simulatePath('M' + targ) : targ;
  }

  var morph = Plugins.morph = function(Tween, start, end) {
    this.node = Tween.node;
    var shape1 = simulatePath(processTarget(start.shape));
    var shape2 = simulatePath(processTarget(end.shape));
    addPoints(shape1, shape2.length - shape1.length);
    addPoints(shape2, shape1.length - shape2.length);
    shape1 = wind(shape1, shape2);
	if (start.reverse || end.reverse) {
		shape1 = shape1.reverse();
	}
	if (start.moveIndex || end.moveIndex) {
		var idx = end.moveIndex !== undefined ? end.moveIndex : start.moveIndex;
		shape1 = shape1.slice(idx).concat(shape1.slice(0, idx));
	}
    this.simulated = Interpolator(shape1, shape2);
  }
  var p = morph.prototype;
  p.update = function(value) {
    var vals = this.simulated(value);
    var d = '';
    for (var i = 0, len = vals.length; i < len; i++) {
      d += (i === 0 ? 'M' : 'L') + vals[i];
    }
    this.node.setAttribute('d', d);
  };
}));