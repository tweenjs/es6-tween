/*!
 * ScrollFast Plugin
 * Scrolling using CSS3 transform
 * MIT-License
 * Requires: es6-tween core files for running this plugin
 */

(function (TWEEN, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(['es6-tween'], function (es6Tween) {
			return factory(es6Tween);
		});
	} else if (typeof module !== "undefined" && module.exports && require('es6-tween')) {
		module.exports = factory(require('es6-tween'));
	} else if (typeof exports !== "undefined" && exports[TWEEN]) {
		factory(exports[TWEEN]);
	} else if (typeof window !== "undefined" && window[TWEEN]) {
		factory(window[TWEEN]);
	}
}
	('TWEEN', function (TWEEN) {
		"use strict";

		// It should work only in Browser (client-side)
		if (typeof window === 'undefined' || !('document' in window)) {
			return false;
		}

		var Plugins = TWEEN.Plugins;
		var Selector = TWEEN.Selector;
		var transformProp = 'transform';
		var is3D = false;

		(function () {
			var tmp = document.createElement('div');
			var _prefix = ['Webkit', 'Moz', 'Ms', 'ms', 'O', 'Khtml', 'Pie'];
			for (var i = 0, len = _prefix.length; i < len; i++) {
				var prop = String(_prefix[i] + 'Transform');
				if (transformProp in tmp.style) {
					// it supports
				} else if (prop in tmp.style) {
					transformProp = prop;
				}
				if (!is3D) {
					is3D = String(_prefix[i] + 'Perspective')in tmp.style;
				}
			}
			tmp.onload = null; // Cause Garbage collecting for rare-case
			tmp = null; // Detach: Free-up DOM Node from memory
		}
			());

		var getOffset = function (v, p, n) {
			if (typeof v === 'string') {
				v = Selector(v);
			}
			return v !== undefined && v !== null ? v.nodeType ? v.getBoundingClientRect()[p === 'scrollX' ? 'left' : 'top'] : typeof v === 'number' ? v : v : n.getBoundingClientRect()[p === 'scrollX' ? 'left' : 'top'];
		}

		Plugins.scrollY = Plugins.scrollX = {
			init: function (start, end, prop) {
				var node = this.node;
				this.sfv = getOffset(start, prop, node);
				this.efv = getOffset(end, prop, node) - 8; // getBoundingClientRect `padding` on each side is 10px as default, but `1px` on each side tries to keep for smooth, so `(10 - 1) - 1`, the last `1px` means of outline pixel, this maybe inaccurate as it's not documented anywhere (FYI, as i'm not see), just finding of my research
				this.efv = this.sfv - this.efv;
				this.efv -= this.sfv;
			}
		}
		Plugins.scrollY.update = Plugins.scrollX.update = function (cv, sv, ev, value, e, prop) {
			var x = this.node.scrollX;
			var y = this.node.scrollY;
			x = x === undefined ? 0 : x < 0 ? x : -x;
			y = y === undefined ? 0 : y < 0 ? y : -y;
			this.node.style[transformProp] = is3D ? 'translate3d(' + x + 'px,' + y + 'px,0px)' : 'translate(' + x + 'px,' + y + 'px)'
		};
	}));
