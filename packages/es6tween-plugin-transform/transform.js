/*!
 * @name CSS and SVG Transform Plugin with CSS Transform Origin support
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 * DEPRECATED: Use `es6tween-plugin-render` plug-in for more compatibility and performance...
 */

(function(factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define(['es6-tween', 'tweenizr'], function(es6Tween, Tweenizr) {
      return factory(es6Tween || Tweenizr);
    });
  } else if (typeof module !== "undefined" && module.exports && (require('es6-tween') || require('tweenizr'))) {
    module.exports = factory(require('es6-tween') || require('tweenizr'));
  } else if (typeof exports !== "undefined" && (exports.TWEEN || exports.Tweenizr)) {
    factory(exports.TWEEN || exports.Tweenizr);
  } else if (typeof window !== "undefined" && (window.TWEEN || window.Tweenizr)) {
    factory(window.TWEEN || window.Tweenizr);
  }
}(function(TWEEN) {
  "use strict";

  var Plugins = TWEEN.Plugins;

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

  var transform3dMap = {
    x: true,
    y: true,
    skew: true,
	scale: true,
	scaleX: true,
	scaleY: true,
	scaleZ: true,
	scale3d: true,
    translate: true,
    skewX: true,
    skewY: true,
    translate3d: true,
    z: true,
	rotate: true,
    rotateX: true,
    rotateY: true,
	rotateZ: true
  };

  var vp = function(v, d, u, dc) { v = ((v * dc) | 0) / dc; return v === undefined ? typeof d === 'number' && u ? d + u : d : typeof v ===
      'number' && u ? v + u : v; }

  var defOrig = ['50%', '50%'];
  var transformProperty = 'transform';
  Plugins.transform = function(Tween, start, end) {
    var node = this.node = Tween.node;
    var vE = Tween._valuesEnd;
    var isSVG = this.isSVG = _SVGElem && node instanceof _SVGElem;
    this.is3D = !isSVG && ('perspective' in node.style || 'webkitPerspective' in node.style);
    this.pxSuffix = isSVG ? 0 : 'px';
    this.degSuffix = isSVG ? 0 : 'deg';
    var origin = Tween._valuesEnd.transformOrigin || defOrig;
    this.cx = 0;
    this.cy = 0;
    if (this.isSVG) {
      this._bbox = {};
      this.bbox = getBBox(node, this._bbox, origin[0], origin[1]);
      this.cx = this._bbox.x;
      this.cy = this._bbox.y;
    } else {
      node.style.transformOrigin = origin.join(" ");
    }
    delete Tween._valuesEnd.transformOrigin;


    this.vals = Tween.object || Tween._from;
	return this;
  }
  var p = Plugins.transform.prototype;
  p.td = 10;
  p.rd = 100;
  p.sd = 1000;
  p.update = function() {
    var transformString = '';
    var node = this.node;
    var vals = this.vals;
    var is3D = this.is3D;
    var isSVG = this.isSVG;
    var pxSuffix = this.pxSuffix;
    var degSuffix = this.degSuffix;
	var cx = this.cx;
	var cy = this.cy;
	var td = this.td;
	var rd = this.rd;
	var sd = this.sd;
	var ts = 0;

    for (var p in vals) {
      if (!transform3dMap[p]) continue

      if (p === 'rotate') {
        transformString += isSVG ? 'rotate(' + vp(vals[p], 0, degSuffix, rd) + ' ' + cx + ' ' + cy + ') ' : 'rotate(' +
          vp(vals[p], 0, degSuffix, rd) + ') ';
      } else if (p === 'x' || p === 'y' || p === 'z') {
		if (!ts) {
        transformString += is3D ? 'translate3d(' + vp(vals.x, 0, pxSuffix, td) + ',' + vp(vals.y, 0, pxSuffix, td) +
          ',' +
          vp(vals.z, 0, pxSuffix, td) + ')' : 'translate(' + vp(vals.x, 0, pxSuffix, td) + ',' + vp(vals.y, 0, pxSuffix, td) +
          ') ';
		  ts = 1;
		}
      } else {
        transformString += p + '(' + vp(vals[p], 0, 0, sd) + ') ';
      }
    }

    if (transformString) {
      if (isSVG) {
        node.setAttribute('transform', transformString)
      } else {
        node.style[transformProperty] = transformString;
      }
    }

  };
}));