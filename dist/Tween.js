(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.TWEEN = global.TWEEN || {})));
}(this, function (exports) { 'use strict';

	var babelHelpers = {};

	babelHelpers.classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	babelHelpers.createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	babelHelpers;

	var Linear = {

		None: function None(k) {
			return k;
		}

	};

	var Quadratic = {

		In: function In(k) {
			return k * k;
		},

		Out: function Out(k) {
			return k * (2 - k);
		},

		InOut: function InOut(k) {
			var n = k * 2;
			var o = k - 1;
			if (n < 1) {
				return 0.5 * n * n;
			}

			return -0.5 * (o * (n - 2) - 1);
		}
	};

	var Cubic = {

		In: function In(k) {
			return k * k * k;
		},

		Out: function Out(k) {
			var n = k - 1;
			return n * n * n + 1;
		},

		InOut: function InOut(k) {
			var n = k * 2;
			if (n < 1) {
				return 0.5 * n * n * n;
			}
			return 0.5 * ((n -= 2) * n * n + 2);
		}

	};

	var Quartic = {

		In: function In(k) {
			return k * k * k * k;
		},

		Out: function Out(k) {
			var n = k - 1;
			return 1 - n * n * n * n;
		},

		InOut: function InOut(k) {
			var n = k * 2;
			if (n < 1) {
				return 0.5 * n * n * n * n;
			}

			return -0.5 * ((n -= 2) * n * n * n - 2);
		}

	};

	var Quintic = {

		In: function In(k) {
			return k * k * k * k * k;
		},

		Out: function Out(k) {
			var n = k - 1;
			return n * n * n * n * n + 1;
		},

		InOut: function InOut(k) {
			var n = k * 2;
			if (n < 1) {
				return 0.5 * n * n * n * n * n;
			}

			return 0.5 * ((n -= 2) * n * n * n * n + 2);
		}

	};

	var Sinusoidal = {

		In: function In(k) {
			return 1 - Math.cos(k * Math.PI / 2);
		},

		Out: function Out(k) {
			return Math.sin(k * Math.PI / 2);
		},

		InOut: function InOut(k) {
			return 0.5 * (1 - Math.cos(Math.PI * k));
		}

	};

	var Exponential = {

		In: function In(k) {
			return k === 0 ? 0 : Math.pow(1024, k - 1);
		},

		Out: function Out(k) {
			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
		},

		InOut: function InOut(k) {
			var n = k * 2;
			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (n < 1) {
				return 0.5 * Math.pow(1024, n - 1);
			}

			return 0.5 * (-Math.pow(2, -10 * (n - 1)) + 2);
		}

	};

	var Circular = {

		In: function In(k) {
			return 1 - Math.sqrt(1 - k * k);
		},

		Out: function Out(k) {
			var n = k - 1;
			return Math.sqrt(1 - n * n);
		},

		InOut: function InOut(k) {
			var n = k * 2;
			if (n < 1) {
				return -0.5 * (Math.sqrt(1 - n * n) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
		}

	};

	var Elastic = {

		In: function In(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;
			var n = k - 1;
			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return -(a * Math.pow(2, 10 * n) * Math.sin((n - s) * (2 * Math.PI) / p));
		},

		Out: function Out(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
		},

		InOut: function InOut(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;
			var n = k * 2;
			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			if (n < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
			}

			return a * Math.pow(2, -10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p) * 0.5 + 1;
		}
	};

	var Back = {

		In: function In(k) {
			var s = 1.70158;
			return k * k * ((s + 1) * k - s);
		},

		Out: function Out(k) {
			var s = 1.70158;
			var n = k - 1;
			return n * n * ((s + 1) * n + s) + 1;
		},
		InOut: function InOut(k) {
			var s = 1.70158 * 1.525;
			var n = k * 2;
			if (n < 1) {
				return 0.5 * (n * n * ((s + 1) * n - s));
			}

			return 0.5 * ((n -= 2) * n * ((s + 1) * n + s) + 2);
		}
	};

	var Bounce = {

		In: function In(k) {
			return 1 - Bounce.Out(1 - k);
		},

		Out: function Out(k) {
			var n = k;
			if (n < 1 / 2.75) {
				return 7.5625 * n * n;
			} else if (n < 2 / 2.75) {
				return 7.5625 * (n -= 1.5 / 2.75) * n + 0.75;
			} else if (n < 2.5 / 2.75) {
				return 7.5625 * (n -= 2.25 / 2.75) * n + 0.9375;
			}
			return 7.5625 * (n -= 2.625 / 2.75) * n + 0.984375;
		},

		InOut: function InOut(k) {
			if (k < 0.5) {
				return Bounce.In(k * 2) * 0.5;
			}

			return Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
		}
	};

var Ease = Object.freeze({
		Linear: Linear,
		Quadratic: Quadratic,
		Cubic: Cubic,
		Quartic: Quartic,
		Quintic: Quintic,
		Sinusoidal: Sinusoidal,
		Exponential: Exponential,
		Circular: Circular,
		Elastic: Elastic,
		Back: Back,
		Bounce: Bounce
	});

	var Utils = {
		Linear: function Linear(p0, p1, t) {
			return (p1 - p0) * t + p0;
		},

		Bernstein: function Bernstein(n, i) {
			var fc = Utils.Factorial;
			return fc(n) / fc(i) / fc(n - i);
		},

		Factorial: function () {
			var a = [1];

			return function factorial(n) {
				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;
			};
		}(),

		CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {
			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
		}
	};

	var Linear$1 = function Linear(v, k) {
		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
	};

	var Bezier = function Bezier(v, k) {
		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;
	};

	var CatmullRom = function CatmullRom(v, k) {
		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = Utils.CatmullRom;

		if (v[0] === v[m]) {
			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}
			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
		}
		if (k < 0) {
			return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
		}

		if (k > 1) {
			return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
		}

		return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
	};

var InterpolationFn = Object.freeze({
		Linear: Linear$1,
		Bezier: Bezier,
		CatmullRom: CatmullRom
	});

	var Tween = function () {
		function Tween(object) {
			babelHelpers.classCallCheck(this, Tween);

			this._object = object;
			this._valuesStart = Object.create(null);
			this._valuesEnd = Object.create(null);
			this._valuesStartRepeat = {};
			this._duration = 1000;
			this._repeat = 0;
			this._yoyo = false;
			this._isPlaying = false;
			this._reversed = false;
			this._delayTime = 0;
			this._startTime = null;
			this._easingFunction = Linear.None;
			this._interpolationFunction = Linear$1;
			this._chainedTweens = [];
			this._onStartCallback = null;
			this._onStartCallbackFired = false;
			this._onUpdateCallback = null;
			this._onCompleteCallback = null;
			this._onStopCallback = null;

			// Set all starting values present on the target object
			for (var field in object) {
				if (object.hasOwnProperty(field)) {
					this._valuesStart[field] = parseFloat(object[field], 10);
				}
			}
		}

		babelHelpers.createClass(Tween, [{
			key: 'to',
			value: function to(properties, duration) {
				if (duration !== undefined) {
					this._duration = duration;
				}
				this._valuesEnd = properties;

				return this;
			}
		}, {
			key: 'start',
			value: function start(time) {
				add(this);

				var _delayTime = this._delayTime;


				this._isPlaying = true;

				this._onStartCallbackFired = false;

				this._startTime = time !== undefined ? time : now();
				this._startTime += _delayTime;

				for (var property in this._valuesEnd) {
					// Check if an Array was provided as property value
					if (this._valuesEnd[property] instanceof Array) {
						if (this._valuesEnd[property].length === 0) {
							continue;
						}

						// Create a local copy of the Array with the start value at the front
						this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
					}

					// If `to()` specifies a property that doesn't exist in the source object,
					// we should not set that property in the object
					if (this._valuesStart[property] === undefined) {
						continue;
					}

					this._valuesStart[property] = this._object[property];

					if (this._valuesStart[property] instanceof Array === false) {
						this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
					}

					this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
				}

				return this;
			}
		}, {
			key: 'stop',
			value: function stop() {
				if (!this._isPlaying) {
					return this;
				}

				remove(this);
				this._isPlaying = false;

				if (this._onStopCallback !== null) {
					this._onStopCallback.call(this._object);
				}

				this.stopChainedTweens();
				return this;
			}
		}, {
			key: 'stopChainedTweens',
			value: function stopChainedTweens() {
				var _chainedTweens = this._chainedTweens;


				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					_chainedTweens[i].stop();
				}
			}
		}, {
			key: 'delay',
			value: function delay(amount) {
				this._delayTime = amount;
				return this;
			}
		}, {
			key: 'repeat',
			value: function repeat(times) {
				this._repeat = times;
				return this;
			}
		}, {
			key: 'yoyo',
			value: function yoyo(_yoyo) {
				this._yoyo = _yoyo;
				return this;
			}
		}, {
			key: 'easing',
			value: function easing(_easing) {
				this._easingFunction = _easing;
				return this;
			}
		}, {
			key: 'interpolation',
			value: function interpolation(_interpolation) {
				this._interpolationFunction = _interpolation;
				return this;
			}
		}, {
			key: 'chain',
			value: function chain() {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				this._chainedTweens = args;
				return this;
			}
		}, {
			key: 'onStart',
			value: function onStart(callback) {
				this._onStartCallback = callback;
				return this;
			}
		}, {
			key: 'onUpdate',
			value: function onUpdate(callback) {
				this._onUpdateCallback = callback;
				return this;
			}
		}, {
			key: 'onComplete',
			value: function onComplete(callback) {
				this._onCompleteCallback = callback;
				return this;
			}
		}, {
			key: 'onStop',
			value: function onStop(callback) {
				this._onStopCallback = callback;
				return this;
			}
		}, {
			key: 'update',
			value: function update(time) {
				var property = void 0;
				var elapsed = void 0;
				var _onUpdateCallback = this._onUpdateCallback;
				var _chainedTweens = this._chainedTweens;
				var _onStartCallback = this._onStartCallback;
				var _object = this._object;
				var _interpolationFunction = this._interpolationFunction;
				var _valuesStartRepeat = this._valuesStartRepeat;
				var _valuesEnd = this._valuesEnd;
				var _valuesStart = this._valuesStart;
				var _onCompleteCallback = this._onCompleteCallback;
				var _duration = this._duration;
				var _delayTime = this._delayTime;


				if (time < this._startTime) {
					return true;
				}

				if (this._onStartCallbackFired === false) {
					if (_onStartCallback !== null) {
						_onStartCallback.call(_object);
					}

					this._onStartCallbackFired = true;
				}

				elapsed = (time - this._startTime) / _duration;
				elapsed = elapsed > 1 ? 1 : elapsed;

				var value = this._easingFunction(elapsed);

				for (property in this._valuesEnd) {
					// Don't update properties that do not exist in the source object
					if (this._valuesStart[property] === undefined) {
						continue;
					}

					var start = this._valuesStart[property] || 0;
					var end = this._valuesEnd[property];

					if (end instanceof Array) {
						_object[property] = _interpolationFunction(end, value);
					} else {
						// Parses relative end values with start as base (e.g.: +10, -3)
						if (typeof end === 'string') {
							if (end.startsWith('+') || end.startsWith('-')) {
								end = start + parseFloat(end, 10);
							} else {
								end = parseFloat(end, 10);
							}
						}

						// Protect against non numeric properties.
						if (typeof end === 'number') {
							_object[property] = start + (end - start) * value;
						}
					}
				}

				if (_onUpdateCallback !== null) {
					_onUpdateCallback.call(this._object, value);
				}

				if (elapsed === 1) {
					if (this._repeat > 0) {
						if (isFinite(this._repeat)) {
							this._repeat--;
						}

						// Reassign starting values, restart by making startTime = now
						for (property in _valuesStartRepeat) {
							if (typeof this._valuesEnd[property] === 'string') {
								_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
							}

							if (this._yoyo) {
								var tmp = _valuesStartRepeat[property];

								_valuesStartRepeat[property] = _valuesEnd[property];
								this._valuesEnd[property] = tmp;
							}

							_valuesStart[property] = _valuesStartRepeat[property];
						}

						if (this._yoyo) {
							this._reversed = !this._reversed;
						}

						this._startTime = time + _delayTime;

						return true;
					}

					if (_onCompleteCallback !== null) {
						_onCompleteCallback.call(this._object);
					}

					for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
						// Make the chained tweens start exactly at the time they should,
						// even if the `update()` method was called way past the duration of the tween
						_chainedTweens[i].start(this._startTime + _duration);
					}

					return false;
				}

				return true;
			}
		}]);
		return Tween;
	}();

	var _tweens = [];

	var getAll = function getAll() {
		return _tweens.slice(0);
	}; // return a copy instead of the actual array

	function removeAll() {
		_tweens.length = 0;
	}

	function add(tween) {
		_tweens.push(tween);
	}

	function remove(tween) {
		var i = _tweens.indexOf(tween);

		if (i !== -1) {
			_tweens.splice(i, 1);
		}
	}

	// Include a performance.now polyfill
	var nowFunc = void 0;

	if (typeof window !== 'undefined' && 'performance' in window && 'now' in window.performance) {
		nowFunc = function nowFunc() {
			return window.performance.now();
		};
	} else if (typeof window !== 'undefined') {
		(function () {
			// IE 8
			Date.now = Date.now || function now() {
				return new Date().getTime();
			};
			var offset = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart : Date.now();
			nowFunc = function nowFunc() {
				window.performance.now = function () {
					return Date.now() - offset;
				};
			};
		})();
	} else {
		(function () {
			// node js
			var hr = 0;
			nowFunc = function nowFunc() {
				hr = process.hrtime();
				return hr[0] * 1000 + hr[1] / 1e6;
			};
		})();
	}

	var curTime = 0;
	function update(time) {
		if (_tweens.length === 0) {
			return false;
		}

		var i = 0;

		curTime = time !== undefined ? time : nowFunc();

		while (i < _tweens.length) {
			if (_tweens[i].update(curTime)) {
				i++;
			} else {
				_tweens.splice(i, 1);
			}
		}

		return true;
	}

	var Easing = Ease;
	var now = nowFunc;
	var Interpolation = InterpolationFn;

	exports.getAll = getAll;
	exports.removeAll = removeAll;
	exports.add = add;
	exports.remove = remove;
	exports.update = update;
	exports.Easing = Easing;
	exports.now = now;
	exports.Interpolation = Interpolation;
	exports.Tween = Tween;

}));