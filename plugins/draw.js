/*!
 * @name SVG Shape Stroke-Line Drawing Plugin
 * @package es6tween-plugin-draw
 * @version v0.1-beta
 * @license MIT-License
 * @credits: Basic Shapes to Path convert code (https://codepen.io/niorad/pen/xmfza) and optimized by @dalisoft
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

  var md = 100;
  var comma = ',';

  var rect = function(rectX, rectY, rectX2, rectY2) { return 'M' + rectX + comma + rectY + ' L' + rectX2 + comma +
      rectY + ' L' + rectX2 + comma + rectY2 + ' L' + rectX + comma + rectY2 + ' L' + rectX + comma + rectY; };
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
  var getProps = function(node, props) { return props.reduce(function(prev, curr) { prev.push(node.getAttribute(
        curr)); return prev; }, []); };
  var rectProps = ['x', 'y', 'width', 'height'];
  var lineProps = ['x1', 'y1', 'x2', 'y2'];
  var circleProps = ['r', 'cx', 'cy'];
  var ellipseProps = ['rx', 'ry', 'cx', 'cy'];

  function getPathString(shape) {
    var tagName = shape.tagName.toLowerCase();
    var pathString = 'M0,0L0,0';
    var props;
    if (tagName === 'rect') {
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

  var val = function(v, c) {
    return typeof(v) === "string" && v.indexOf("%") > -1 ? (parseFloat(v) / 100) * c :
      parseFloat(v || 0);
  }

  var simulatePath = function(shape, v) {
    var path = document.createElementNS(ns, 'path');
    var vv = v.split(" ");
    var start = vv[0];
    var end = vv[1];
    var strokeWidth = parseFloat(shape.getAttribute('stroke-width') || 1);
    path.setAttribute('d', getPathString(shape));
    var length = path.getTotalLength();
    if (ff.test(ua)) { length /= strokeWidth; }
    if (end < start) {
      var tmp = start;
      start = end;
      end = tmp;
    }
    start = -val(start, length);
    end = val(end, length) + start;
    return [start, end, length];
  }

  var draw = Plugins.draw = function(Tween, start, end) {
    this.node = Tween.node;
    this.simulated1 = simulatePath(this.node, start);
    this.simulated2 = simulatePath(this.node, end);
    this.simulated = Interpolator(this.simulated1, this.simulated2);
  }
  var p = draw.prototype;
  p.update = function(value) {
    var vals = this.simulated(value);
    this.node.style.strokeDashoffset = ((vals[0] * md) | 0) / md;
    this.node.style.strokeDasharray = ((vals[1] * md) | 0) / md + comma + ((vals[2] * md) | 0) / md;
  };
}));