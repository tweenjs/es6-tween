/*!
 * @name Attributes Plugin
 * @package es6tween-plugin-attr
 * @version v0.1-beta
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(['es6-tween', 'tweenizr'], factory);
	} else if (typeof module !== "undefined" && module.exports && !!require('es6-tween')) {
		module.exports = factory(require('es6-tween'));
	} else if (typeof exports !== "undefined" && exports.TWEEN) {
		factory(exports.TWEEN);
	} else if (typeof window !== "undefined" && window.TWEEN) {
		factory(window.TWEEN);
	}
}
	(function (TWEEN) {
		"use strict";

		var Plugins = TWEEN.Plugins;

		var transform3dMap = {
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
			rotateZ: true,
			scrollTop: true,
			scrollLeft: true
		};

		Plugins.attr = {
			init: function (start, end, property) {
				if (!start && end) {
					start = this._valuesStart[property] = {}
					for (var p in end) {
						start[p] = this.node.getAttribute(p)
					}
				}
			},
			update: function (attrs) {
				for (var p in attrs) {
					if (Plugins[p] || transform3dMap[p]) {
						continue;
					}
					this.node.setAttribute(p, attrs[p]);
				}
			}
		}
	}));
