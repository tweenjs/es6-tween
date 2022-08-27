/*!
 * @name SVG Shape Stroke-Line Drawing, Motion Path and Along Path (same thing in 2-way) Plugin
 * @credits: Basic Shapes to Path convert code (https://codepen.io/niorad/pen/xmfza) and optimized by @dalisoft
 * @requires: es6-tween core files for running this plugin
 */

(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(['es6-tween', 'tweenizr'], function (es6Tween, Tweenizr) {
			return factory(es6Tween || Tweenizr);
		});
	} else if (typeof module !== "undefined" && module.exports && (require('es6-tween') || require('tweenizr'))) {
		module.exports = factory(require('es6-tween') || require('tweenizr'));
	} else if (typeof exports !== "undefined" && (exports.TWEEN || exports.Tweenizr)) {
		factory(exports.TWEEN || exports.Tweenizr);
	} else if (typeof window !== "undefined" && (window.TWEEN || window.Tweenizr)) {
		factory(window.TWEEN || window.Tweenizr);
	}
}
	(function (TWEEN) {
		"use strict";

		var Plugins = TWEEN.Plugins;

		var md = 100;
		var comma = ',';

		var rect = function (rectX, rectY, rectX2, rectY2) {
			return 'M' + rectX + comma + rectY + ' L' + rectX2 + comma +
			rectY + ' L' + rectX2 + comma + rectY2 + ' L' + rectX + comma + rectY2 + ' L' + rectX + comma + rectY;
		};
		var line = function (x1, y1, x2, y2) {
			return 'M' + x1 + comma + y1 + 'L' + x2 + comma + y2;
		};
		var circle = function (r, cX, cY) {
			var cxr = cX - r;
			var r2 = r * 2;
			var cxr2 = cxr + r2;
			return 'M' + cxr + comma + cY + ' A ' + r + comma + r + ' 0 1,0 ' + cxr2 + comma + cY + ' A ' + r + comma + r +
			' 0 1,0 ' + (cxr2 - r2) + comma + cY;
		};
		var ellipse = function (rX, rY, cX, cY) {
			var rX2 = rX * 2;
			var cXR = cX - rX;
			var cXR2 = cXR + rX2;
			return 'M' + cXR + comma + cY + ' A ' + rX + comma + rY + ' 0 1,0 ' + cXR2 + comma + cY + ' A ' + rX + comma +
			rY + ' 0 1,0 ' + (cXR2 - rX2) + comma + cY;
		};
		var ns = 'http://www.w3.org/2000/svg';
		var ua = navigator.userAgent;
		var getProps = function (node, props) {
			return props.reduce(function (prev, curr) {
				prev.push(node.getAttribute(curr));
				return prev;
			}, []);
		};
		var rectProps = ['x', 'y', 'width', 'height'];
		var lineProps = ['x1', 'y1', 'x2', 'y2'];
		var circleProps = ['r', 'cx', 'cy'];
		var ellipseProps = ['rx', 'ry', 'cx', 'cy'];

		function getPathString(shape) {
			if (typeof shape === 'string') {
				return shape;
			}
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
			} else if (tagName === 'g') {
				var childs = shape.children;
				for (var i = 0, len = childs.length; i < len; i++) {
					pathString += getPathString(childs[i]);
				}
			}
			return pathString;
		}

		var val = function (v, c) {
			return typeof(v) === "string" && v.indexOf("%") > -1 ? (parseFloat(v) / 100) * c :
			parseFloat(v || 0);
		}

		var getAsPath = function (d) {
			var path = document.createElementNS(ns, 'path');
			path.setAttribute('d', getPathString(d));
			return path;
		}

		var getMotionPath = function (d) {
			var path = document.createElementNS(ns, 'path');
			path.setAttribute('d', getPathString(d));
			this.path = path;
			this.length = path.getTotalLength();
			return this;
		}

		var d2r = 180 / Math.PI;

		getMotionPath.prototype = {
			angle: 90,
			x: 0,
			y: 0,
			getPointAtTime: function (t) {
				var path = this.path;
				var length = this.length;
				var position = path.getPointAtLength(t * length);
				this.angle = Math.atan2(position.y - this.y, position.x - this.x) * d2r;
				this.x = position.x;
				this.y = position.y;
				return this;
			}
		}

		var simulatePath = function (shape, v) {
			var path = getAsPath(shape);
			var vv = v.split(" ");
			var start = vv[0];
			var end = vv[1];
			var strokeWidth = parseFloat(shape.getAttribute('stroke-width') || 1);
			var length = path.getTotalLength();
			if (ua.indexOf('Firefox') !== -1) {
				length /= strokeWidth;
			}
			if (end < start) {
				var tmp = start;
				start = end;
				end = tmp;
			}
			start = -val(start, length);
			end = val(end, length) + start;
			return {
				start: start,
				end: end,
				length: length
			};
		}

		Plugins.draw = {
			init: function (start, end) {
				var vs = simulatePath(this.node, start);
				var ve = simulatePath(this.node, end);
				ve.start -= vs.start;
				ve.end -= vs.end;
				ve.length -= vs.length;
				this.drawStart = vs;
				this.drawEnd = ve;
				return this;
			},
			update: function (currentValue, start, end, value) {
				var vs = this.drawStart,
				ve = this.drawEnd;
				this.node.style.strokeDashoffset = (((vs.start + ve.start * value) * md) | 0) / md;
				this.node.style.strokeDasharray = (((vs.end + ve.end * value) * md) | 0) / md + comma + (((vs.length + ve.length * value) * md) | 0) / md;
			}
		}

		var transformProp = (function () {
			var doc = typeof document !== 'undefined' ? document.createElement('div').style : null;
			var _prefix = doc === null || 'WebkitTransform' in doc ? 'WebkitTransform' : 'MozTransform' in doc ? 'MozTransform' : 'OTransform' in doc ? 'OTransform' : 'MsTransform' in doc ? 'MsTransform' : 'msTransform' in doc ? 'msTransform' : 'transform' in doc ? 'transform' : '';
			return _prefix;
		}
			());

		Plugins.alongPath = {
			init: function (start, end) {
				if (!this.node) {
					return false;
				}
				var shape = (end && end.shape ? end.shape : end) || (start && start.shape ? start.shape : start) || this.node;
				var useAngle = end && end.angle || start && start.angle;
				this.x = 0;
				this.y = 0;
				if (typeof shape === 'string' || shape instanceof SVGElement) {
					this.motion = new getMotionPath(shape);
					this.elem = elem;
				}
				if (elem instanceof SVGElement) {
					this.x =  + (elem.getAttribute("cx") || elem.getAttribute("x") || 0);
					this.y =  + (elem.getAttribute("cy") || elem.getAttribute("y") || 0);
				}
				this.isSVGElem = elem instanceof SVGElement;
				this.useAngle = !(elem instanceof SVGCircleElement) && useAngle === true;
			},
			update: function (currentValue, start, end, value) {
				var elem = this.node;
				if (elem) {
					var motion = this.motion.getPointAtTime(value)
						var isSVGElem = this.isSVGElem;
					var x = motion.x;
					var y = motion.y;
					var dx = this.x;
					var dy = this.y;
					var cx = x - dx;
					var cy = y - dy;
					var useAngle = this.useAngle;
					var angle = motion.angle;
					if (isSVGElem) {
						var transform = 'translate(' + cx;
						transform += ' ' + cy + ')';
						if (useAngle) {
							transform += ' rotate( ' + angle + ' ' + dx + ' ' + dy + ')'
						}
						elem.setAttribute('transform', transform)
					} else {
						var transformStyle = 'translate(' + cx + 'px, ' + cy + 'px) rotate(' + (useAngle ? angle : 0) + 'deg)'
							elem.style[transformProp] = transformStyle;
					}
				}
			}
		};

			Plugins.motionPath = {
				init: function (start, end) {
					if (!this.node) {
						return false;
					}
					var shape = this.node;
					var elem = (end && end.shape ? end.shape : end) || (start && start.shape ? start.shape : start) || shape;
					var useAngle = end && end.angle || start && start.angle; ;
					this.x = 0;
					this.y = 0;
					if (typeof shape === 'string' || shape instanceof SVGElement) {
						this.motion = new getMotionPath(shape);
						this.elem = elem;
					}
					if (elem instanceof SVGElement) {
						this.x =  + (elem.getAttribute("cx") || elem.getAttribute("x") || 0);
						this.y =  + (elem.getAttribute("cy") || elem.getAttribute("y") || 0);
					}
					this.isSVGElem = elem instanceof SVGElement;
					this.useAngle = !(elem instanceof SVGCircleElement) && useAngle === true;
				},
				update: function (currentValue, start, end, elapsed) {
					var elem = this.elem;
					if (elem) {
						var motion = this.motion.getPointAtTime(elapsed);
						var isSVGElem = this.isSVGElem;
						var x = motion.x;
						var y = motion.y;
						var dx = this.x;
						var dy = this.y;
						var cx = x - dx;
						var cy = y - dy;
						var useAngle = this.useAngle;
						var angle = motion.angle;
						if (isSVGElem) {
							var transform = 'translate(' + cx;
							transform += ' ' + cy + ')';
							if (useAngle) {
								transform += ' rotate( ' + angle + ' ' + dx + ' ' + dy + ')'
							}
							elem.setAttribute('transform', transform)
						} else {
							var transformStyle = 'translate(' + cx + 'px, ' + cy + 'px) rotate(' + (useAngle ? angle : 0) + 'deg)'
								elem.style[transformProp] = transformStyle;
						}
					}
				}
			};
		}));
