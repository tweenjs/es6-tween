/*!
 * @name Keyframe Plugin
 * @description Use CSS-keyframes in es6-tween to get more powerful control, better browser support and maybe faster performance (not always)
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

		var Interpolator = TWEEN["Interpolator"];

		var keyframe = Plugins["keyframe"] = {
			init: function (startKeyFrame, endKeyFrame) {
				var TweenInstance = this;
				var keyFrame = endKeyFrame || startKeyFrame;
				var keyframePositions = [],
				keyframeValues = [],
				keyframeEasings = [],
				keyframeInterpolators = [];
				for (var position in keyFrame) {
					var floatedValue = parseFloat(position);
					var getPosition = isNaN(+position) ? position : +position;
					var newPosition = floatedValue === 0 ? 0 : position.indexOf('ms') > -1 ? floatedValue / TweenInstance._duration : position.indexOf('sec') > -1 ? (floatedValue * 1000) / TweenInstance._duration : floatedValue <= 1 ? floatedValue : floatedValue / 100;
					if (newPosition !== getPosition) {
						var value = keyFrame[getPosition];
						keyFrame[newPosition] = value;
						delete keyFrame[getPosition];
					}
				}
				for (var position in keyFrame) {
					keyframePositions.push(+position);
				}
				for (var i = 1, len = keyframePositions.length; i < len; i++) {
					var prev = keyframePositions[i - 1];
					var curr = keyframePositions[i];

					if (curr < prev) {
						keyframePositions.splice(i - 1, 0, curr)
						keyframePositions.splice(i + 1, 1);
					}
				}
				for (var i = 0, len = keyframePositions.length; i < len; i++) {
					keyframeValues.push(keyFrame[keyframePositions[i]]);
				}
				if (keyframePositions[0] !== 0) {
					var _o = {};
					for (var key in keyframeValues[0]) {
						_o[key] = TweenInstance.object[key];
					}
					keyframePositions.unshift(0);
					keyframeValues.unshift(_o);
				}
				for (var i = 0, len = keyframeValues.length, val; i < len; i++) {
					val = keyframeValues[i];
					if (i) {
						var prev = keyframeValues[i - 1];
						if (val && val.easing) {
							keyframeEasings.push(val.easing);
							delete val.easing;
						}
						if (Array.isArray(prev.scaleX)) {
							prev.scaleX = prev.scaleX.pop();
						}
						keyframeInterpolators.push(Interpolator(prev, val));
					}
				}
				this.keyframePositions = keyframePositions;
				this.keyframeInterpolators = keyframeInterpolators;
				this.keyframeEasings = keyframeEasings;
			},
			update: function (c, s, e, t) {
				var currentIndexOfKeyFrames = 0;
				var keyframePositions = this.keyframePositions;
				var keyframeInterpolators = this.keyframeInterpolators;
				var TweenObject = this.object;
				var keyframeEasings = this.keyframeEasings;
				var i = 0,
				shouldStartInterpolation,
				currentPosition,
				nextPosition,
				calculatedPosition,
				closerPosition,
				calculatedElapsed,
				offset,
				currentElapsed,
				ease,
				getEqualElapsed = t > 1 ? Math.abs(Math.round(t) - t) : t < 0 ? t : 0;
				t = t > 1 ? 1 : t < 0 ? 0 : t;
				while (i < keyframePositions.length) {
					if (t > keyframePositions[i]) {
						currentIndexOfKeyFrames = i;
						shouldStartInterpolation = true;
					}
					i++
				}
				if (shouldStartInterpolation) {
					currentPosition = keyframePositions[currentIndexOfKeyFrames];
					nextPosition = keyframePositions[currentIndexOfKeyFrames + 1];
					if (t > currentPosition) {
						calculatedPosition = nextPosition - currentPosition;
						closerPosition = 1 / calculatedPosition;
						offset = t - currentPosition;
						calculatedElapsed = closerPosition * offset;
						currentElapsed = calculatedElapsed + getEqualElapsed;
						ease = keyframeEasings[currentIndexOfKeyFrames];
						if (ease) {
							currentElapsed = ease(currentElapsed);
						}
						var interpolator = keyframeInterpolators[currentIndexOfKeyFrames](currentElapsed);
						for (var p in interpolator) {
							TweenObject[p] = interpolator[p];
						}
					}
				}
			}
		}

	}));
