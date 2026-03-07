/*!
 * @name Three.js Plugin (but should work with `pixi` and `babylon`)
 * @description 3D Rendering engine plugin
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 * @note optimized for Advanced optimization
 */

(function (name, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(['es6-tween'], function (es6Tween) {
			return factory(es6Tween);
		});
	} else if (typeof module !== "undefined" && module.exports && !!require('es6-tween')) {
		module.exports = factory(require('es6-tween'));
	} else if (typeof exports !== "undefined" && exports[name]) {
		factory(exports[name]);
	} else if (typeof window !== "undefined" && window[name]) {
		factory(window[name]);
	} else if (this[name]) {
		factory(this[name]);
	}
}
	('TWEEN', function (TWEEN, undefined) {
		"use strict";

		var Plugins = TWEEN["Plugins"];
		var InterTween = TWEEN["Interpolator"];

		var scale = "scale";

		Plugins["pixi"] = Plugins["three"] = Plugins["babylon"] = {
			init: function (start, end, property) {
				var t = this,
				target = null,
				vS,
				_noLoopCall = true;
				if ((target = t["node"]) && typeof target === 'object' && !!target && target.nodeType === undefined) {
					vS = t["object"];
					_noLoopCall = false;
				} else {
					target = vS = t["object"];
				}
				var vE = t["_valuesEnd"];
				var propStart,
				propEnd,
				is3DEngine = (property === "three" || property === "babylon"),
				_mainObject = {},
				_startObject = {},
				_tweenObject,
				_copyObject,
				_addSupport = function (prop, numeric) {
					if (_mainObject[prop] === undefined) {
						if (numeric) {
							if (end[prop] !== undefined || vE[prop] !== undefined) {
								_mainObject[prop] = vE[prop] !== undefined ? vE[prop] : end[prop] !== undefined ? end[prop] : 0;
							}
						} else if ((vE[prop + "X"] !== undefined || vE[prop + "Y"] !== undefined || vE[prop + "Z"] !== undefined) || (end[prop + "X"] !== undefined || end[prop + "Y"] !== undefined || end[prop + "Z"] !== undefined) || (typeof vE[prop] === 'object' && !!vE[prop]) || (typeof end[prop] === 'object' && !!end[prop])) {
							_mainObject[prop] = {
								x: end[prop + "X"] !== undefined ? end[prop + "X"] : vE[prop + "X"] !== undefined ? vE[prop + "X"] : !!end[prop] ? end[prop]["x"] : !!vE[prop] && vE[prop]["x"] !== undefined ? vE[prop]["x"] : vS[prop] && vS[prop]["x"] !== undefined ? vS[prop]["x"] : start && start[prop] && start[prop]["x"] !== undefined ? start[prop]["x"] : target && target[prop] && target[prop]["x"] !== undefined ? target[prop]["x"] : prop === scale ? 1 : 0,
								y: end[prop + "Y"] !== undefined ? end[prop + "Y"] : vE[prop + "Y"] !== undefined ? vE[prop + "Y"] : !!end[prop] ? end[prop]["y"] : !!vE[prop] && vE[prop]["y"] !== undefined ? vE[prop]["y"] : vS[prop] && vS[prop]["y"] !== undefined ? vS[prop]["y"] : start && start[prop] && start[prop]["y"] !== undefined ? start[prop]["y"] : target && target[prop] && target[prop]["y"] !== undefined ? target[prop]["y"] : prop === scale ? 1 : 0
							};
							if (is3DEngine) {
								_mainObject[prop]["z"] = end[prop + "Z"] !== undefined ? end[prop + "Z"] : vE[prop + "Z"] !== undefined ? vE[prop + "Z"] : !!end[prop] ? end[prop]["z"] : !!vE[prop] && vE[prop]["z"] !== undefined ? vE[prop]["z"] : vS[prop] && vS[prop]["z"] !== undefined ? vS[prop]["z"] : start && start[prop] && start[prop]["z"] !== undefined ? start[prop]["z"] : target && target[prop] && target[prop]["z"] !== undefined ? target[prop]["z"] : prop === scale ? 1 : 0;
							}
						}
					}
					if (_startObject[prop] === undefined && _mainObject[prop] !== undefined) {
						var isExistMainDirect = ((start && (prop + "X")in start) || (start && (prop + "Y")in start) || (start && (prop + "Y")in start)) || ((vS && (prop + "X")in vS) || (vS && (prop + "Y")in vS) || (vS && (prop + "Y")in vS))
						if (isExistMainDirect) {
							var __obj = {};
							__obj["x"] = vS[prop + "X"] !== undefined ? vS[prop + "X"] : vS[prop] && vS[prop]["x"] !== undefined ? vS[prop]["x"] : target && target[prop] && target[prop]["x"] !== undefined ? target[prop]["x"] : prop === scale ? 1 : 0;
							__obj["y"] = vS[prop + "Y"] !== undefined ? vS[prop + "Y"] : vS[prop] && vS[prop]["y"] !== undefined ? vS[prop]["y"] : target && target[prop] && target[prop]["y"] !== undefined ? target[prop]["y"] : prop === scale ? 1 : 0;
							__obj["z"] = vS[prop + "Z"] !== undefined ? vS[prop + "Z"] : vS[prop] && vS[prop]["z"] !== undefined ? vS[prop]["z"] : target && target[prop] && target[prop]["z"] !== undefined ? target[prop]["z"] : prop === scale ? 1 : 0;
							_startObject[prop] = __obj;
						} else {
							_startObject[prop] = start && start[prop] !== undefined ? start[prop] : vS[prop] !== undefined ? vS[prop] : target && target[prop] ? target[prop] : prop === scale ? 1 : 0;
						}
					}
				}
				_addSupport("scale", false);
				_addSupport("anchor", false);
				_addSupport("pivot", false);
				_addSupport("position", false);
				_addSupport("rotation", !is3DEngine);

				this.target = target;
				this.loop = !_noLoopCall;
				this._tweenObject = InterTween(_startObject, _mainObject);
				this.startObject = _startObject;

				return this;
			}
		}

		Plugins["pixi"]["update"] = Plugins["three"]["update"] = Plugins["babylon"]["update"] = function (v, elapsed) {
			var loop = this.loop;
			this._tweenObject(elapsed);
			var call = this.startObject;
			if (loop) {
				var target = this.target;
				for (var p in call) {
					var callVal = call[p];
					var targ = target[p];
					for (var p2 in callVal) {
						targ[p2] = callVal[p2];
					}
				}
			}
		};

	}));
