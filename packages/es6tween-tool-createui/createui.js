/*!
 * @name createUi tool
 * @package es6tween-tool-createui
 * @license MIT-License
 * @requires: es6-tween core files for running this plugin
 */

(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(['es6-tween', '@tweenjs/tween.js'], function (es6Tween, TWEEN) {
			return factory(es6Tween || TWEEN);
		});
	} else if (typeof module !== "undefined" && module.exports && (require('es6-tween') || require('@tweenjs/tween.js'))) {
		module.exports = factory(require('es6-tween') || require('@tweenjs/tween.js'));
	} else if (typeof exports !== "undefined" && exports.TWEEN) {
		factory(exports.TWEEN);
	} else if (typeof window !== "undefined" && window.TWEEN) {
		factory(window.TWEEN);
	}
}
	(function (TWEEN) {
		"use strict";

		var h = function (tag, attrs, childNodes) {
			var el = document.createElement(tag);
			if (attrs) {
				for (var attr in attrs) {
					el.setAttribute(attr, attrs[attr])
				}
			}
			if (childNodes) {
				childNodes.map(function (child) {
					if (typeof child === 'string' || typeof child === 'number') {
						child = document.createTextNode(child)
					}
					el.appendChild(child)
				});
			}
			return el;
		}
		var createUiElements = function (tweenParams) {
			return h('div', {
				'class': 'controls-container'
			}, [
					h('div', {
						'class': 'controls'
					}, [
							h('div', {
								'class': 'button',
								'id': 'play'
							}, [h('i', {
										'class': 'fa fa-play'
									})]),
							h('div', {
								'class': 'button',
								'id': 'pause'
							}, [h('i', {
										'class': 'fa fa-pause'
									})]),
							h('div', {
								'class': 'button',
								'id': 'stop'
							}, [h('i', {
										'class': 'fa fa-stop'
									})]),
							h('div', {
								'class': 'button',
								'id': 'restart'
							}, [h('i', {
										'class': 'fa fa-refresh'
									})]),
							h('div', {
								'id': 'seekDiv'
							}, [h('input', {
										'type': 'range',
										'id': 'seek',
										'min': 0,
										'max': tweenParams._duration * (isFinite(tweenParams._repeat) ? 1 : tweenParams._repeat + 1),
										'value': 0
									})]),
							h('div', {
								'id': 'durationDiv'
							}, [h('input', {
										'type': 'range',
										'id': 'duration',
										'min': 0,
										'max': tweenParams._duration * 2,
										'value': tweenParams._duration
									})]),
							h('div', {
								'id': 'easingDiv'
							}, [h('select', {
										'id': 'easing'
									})]),
							h('div', {
								'class': 'button',
								'id': 'reverseDiv'
							}, [h('input', {
										'id': 'reverse',
										'type': 'checkbox',
										'value': tweenParams._reversed,
										'checked': tweenParams._reversed
									})]),
							h('div', {
								'class': 'button',
								'id': 'yoyoDiv'
							}, [h('input', {
										'id': 'yoyo',
										'type': 'checkbox',
										'value': tweenParams._yoyo,
										'checked': tweenParams._yoyo
									})]),
							h('div', {
								'id': 'repeatDiv'
							}, [
									h('input', {
										'type': 'text',
										'id': 'repeat',
										'value': tweenParams._repeat
									})
								])
						])])
		}
		TWEEN.createUi = function (tween, container) {
			var ui = createUiElements(tween);
			var controlButtons = [].slice.call(ui.querySelectorAll(".button"));
			var seek = ui.querySelector("#seek");
			var duration = ui.querySelector("#duration");
			var easing = ui.querySelector("#easing");
			var repeat = ui.querySelector("#repeat");
			var yoyo = ui.querySelector("#yoyo");
			var reverse = ui.querySelector("#reverse");

			if (!tween.reverse) {
				reverse.parentNode.style.display = 'none';
			}
			if (!tween.seek) {
				seek.parentNode.style.display = 'none';
			}
			if (!tween.yoyo) {
				yoyo.parentNode.style.display = 'none';
			}
			container.appendChild(ui);
			controlButtons.map(function (button) {
				button.addEventListener("contextmenu", function (e) {
					e.preventDefault();
					return false;
				});
				if (!tween[button.id] && button.id.indexOf('Div') === -1) {
					button.style.display = 'none';
					return false;
				}
				var _clickEvent = 'ontap' in button ? 'tap' : 'click';
				button.addEventListener(_clickEvent, function (e) {
					switch (button.id) {
					case "pause":
						tween.pause();
						break;
					case "play":
						tween.play();
						break;
					case "stop":
						tween.stop();
						break;
					case "restart":
						tween.restart();
						break;
					}
				});
			});

			// https://github.com/tweenjs/es6-tween/issues/36
			// It currently not works as excepted
			var onSeekChange = function (e) {
				tween.seek(parseInt(e.target.value))
			}
			seek.addEventListener("input", onSeekChange)
			seek.addEventListener("change", onSeekChange)
			// Duration Change
			var onDurationChange = function (e) {
				tween.duration(+e.target.value);
			}
			duration.addEventListener("input", onDurationChange)
			duration.addEventListener("change", onDurationChange)
			var _easingList = {}
			for (var e in Easing) {
				var _easingScope = Easing[e]
					for (var t in _easingScope) {
						var _easing = _easingScope[t]
							var easeOption = document.createElement('option')
							if (typeof _easing(0) !== 'number') {
								_easing = _easing(10)
									t += '=10'
							}
							var easeType = e + '.' + t
							easeOption.value = easeType
							easeOption.textContent = easeType
							easing.appendChild(easeOption)
							_easingList[easeType] = _easing
					}
			}
			easing.addEventListener('change', function (e) {
				if (_easingList[e.target.value]) {
					tween.easing(_easingList[e.target.value])
				}
			})
			yoyo.addEventListener('change', function (e) {
				tween.yoyo(e.target.checked)
			})
			repeat.addEventListener('change', function (e) {
				var r = e.target.value,
				_isFinite = r !== 'Infinity',
				num = _isFinite ? parseInt(r) : 1;
				if (_isFinite) {
					seek.removeAttribute('disabled')
					seek.setAttribute('max', tween._duration * (num + 1))
				} else {
					seek.setAttribute('disabled', true)
					seek.setAttribute('max', tween._duration)
				}
				tween.repeat(!_isFinite ? Infinity : num)
			})
			reverse.addEventListener('change', function (e) {
				tween.reverse(e.target.checked)
			})
		}

	}));
