/*!
 * @name Event Plugin
 * @description Write less code, but do animations effecient, clean and easier
 * @package es6tween-plugin-keyframe
 * @version v1.0 (It's tested plugin before published and even used in my old project)
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(['es6-tween'], factory);
	} else if (typeof module !== "undefined" && module.exports && !!require('es6-tween')) {
		module.exports = factory(require('es6-tween'));
	} else if (typeof exports !== "undefined" && exports["TWEEN"]) {
		factory(exports["TWEEN"]);
	} else if (typeof window !== "undefined" && window["TWEEN"]) {
		factory(window["TWEEN"]);
	} else if (this["TWEEN"]) {
		factory(this["TWEEN"]);
	}
}
	(function (TWEEN) {
		"use strict";

		var Plugins = TWEEN["Plugins"];
		var Tween = TWEEN["Tween"];

		var cloneMap = {
			_easingFunction: true,
			_repeat: true,
			_delayTime: true,
			_repeatDelayTime: true,
			_reverseDelayTime: true,
			_events: true
		}

		var cloneTweenInstance = function (elem, oldTween, from, to, options) {
			var tweenInstance = new Tween(elem, from);
			if (!!options) {
				tweenInstance.to(to, options);
			} else {
				tweenInstance.to(to, oldTween._duration)
				for (var p in oldTween) {
					if (p !== "constructor" && cloneMap[p]) {
						tweenInstance[p] = oldTween[p];
					}
				}
			}
			return tweenInstance;
		}

		Plugins["event"] = {
			init: function (startEvent, endEvent) {
				var TweenInstance = this;
				var elem = TweenInstance["node"];
				if (!(elem && elem.nodeType) || (elem === window || elem === document) || !(startEvent !== undefined || endEvent !== undefined)) {
					return;
				}
				var events = Object.assign(startEvent || {}, endEvent || {});
				var _obj_ = TweenInstance.object;
				var _self_;
				for (var p in events) {
					elem.addEventListener(p, function (e) {
						if (TweenInstance.isPlaying()) {
							TweenInstance.pause();
						}
						if (_self_ && _self_.isPlaying()) {
							_self_.pause();
						}
						var t = e["type"];
						if (!!events[t]) {
							var copy = Object.assign({}, events[t]);
							var opt = copy["options"];
							delete copy["options"];
							var act = copy["action"];
							delete copy["action"];
							act && act.call(elem, e);
							_self_ = cloneTweenInstance(elem, TweenInstance, _obj_, copy, opt).start();
						}
					});
				}

				return false;
			},
			skipProcess: true
		}

	}));
