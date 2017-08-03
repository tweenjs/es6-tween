/*!
 * @name Transform Plugin
 * @package es6tween-plugin-transform
 * @version v0.1-beta
 * @license MIT-License
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

  var _SVGElem = typeof(window) !== 'undefined' && window.SVGElement;

  var getBBox = function(node, bbox, x, y) {
    var bounds = node.getBBox();
    var left = bounds.x;
    var top = bounds.y;
    var width = bounds.width;
    var height = bounds.height;

    x = typeof(x) === 'number' ? left + x : typeof x === 'string' && x.indexOf('%') > -1 ? left + (width * (
      parseFloat(x) / 100)) : left + (width / 2)
    y = typeof(y) === 'number' ? left + y : typeof y === 'string' && y.indexOf('%') > -1 ? top + (height * (
      parseFloat(y) / 100)) : top + (height / 2)

    if (bbox.x !== undefined && bbox.y !== undefined) {
      var diffX = bbox.x - x
      var diffY = bbox.y - y

      x += x - diffX
      y += y - diffY
    }

    bbox.x = x
    bbox.y = y

    return bbox
  };

  var transform3dMap = { x: true, y: true, rotate: true, skew: true, translate: true, skewX: true, skewY: true,
    translate3d: true, z: true, rotateX: true, rotateY: true };

  var defOrig = ['50%', '50%'];
  var transform = Plugins.transform = function(Tween, start, end) {
    this.node = Tween.node;
    this.isSVG = _SVGElem && this.node instanceof _SVGElem;
    var origin = Tween._valuesEnd.transformOrigin || defOrig;
    if (this.isSVG) {
      this._bbox = {};
      this.bbox = getBBox(this.node, this._bbox, origin[0], origin[1]);
      this.cx = this._bbox.x;
      this.cy = this._bbox.y;
    } else {
      this.node.style.transformOrigin = origin.join(" ");
    }
    delete Tween._valuesEnd.transformOrigin;
    this.transformProperty = 'transform';

    for (let p in end) {
      if (!transform3dMap[p]) continue

      let val = end[p];
      if (start[p] === end[p]) {
        delete start[p];
        delete end[p];
      } else if (this.isSVG) {
        if ((p === 'rotate' || p === 'x' || p === 'y' || p === 'z') && typeof val === "string") {
          end[p] = parseFloat(val);
          start[p] = parseFloat(start[p]);
        }
      } else {
        if ((p === 'rotate' || p === 'x' || p === 'y' || p === 'z') && typeof val === "number") {
          end[p] += p === 'rotate' ? 'deg' : 'px';
          start[p] += p === 'rotate' ? 'deg' : 'px';
        }
      }
    }
  }
  var p = transform.prototype;
  p.postprocess = function(start, end) {
    this.simulated = end;
  }
  p.update = function(value) {
    var vals = this.simulated(value);
    var transformString = '';
    var node = this.node;
    var isSVG = this.isSVG;

    for (let p in vals) {

      if (p === 'rotate') {
        transformString += isSVG ? 'rotate(' + vals[p] + ' ' + this.cx + ' ' + this.cy + ') ' : 'rotate(' + vals[
          p] + ') ';
      } else if (p === 'x' || p === 'y' || p === 'z') {
        transformString += vals.z !== undefined ? 'translate3d(' + (vals.x || 0) + ', ' + (vals.y || 0) + ', ' +
          (vals.z || 0) + ')' : 'translate(' + (vals.x || 0) + ', ' + (vals.y || 0) + ') ';
      } else {
        transformString += p + '(' + vals[p] + ') ';
      }
    }

    if (transformString) {
      if (isSVG) {
        node.setAttribute('transform', transformString)
      } else {
        node.style[this.transformProperty] = transformString;
      }
    }

  };
}));