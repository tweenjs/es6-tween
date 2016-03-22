/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */
import { Linear } from './ease';
import { Linear as LinearInt } from './interpolation';
import { add, remove, now } from './index';

export class Tween {

	constructor(object) {
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
		this._interpolationFunction = LinearInt;
		this._chainedTweens = [];
		this._onStartCallback = null;
		this._onStartCallbackFired = false;
		this._onUpdateCallback = null;
		this._onCompleteCallback = null;
		this._onStopCallback = null;

		// Set all starting values present on the target object
		for (const field in object) {
			if (object.hasOwnProperty(field)) {
				this._valuesStart[field] = parseFloat(object[field], 10);
			}
		}
	}

	to(properties, duration) {
		if (duration !== undefined) {
			this._duration = duration;
		}
		this._valuesEnd = properties;

		return this;
	}

	start(time) {
		add(this);

		const { _delayTime } = this;


		this._isPlaying = true;

		this._onStartCallbackFired = false;

		this._startTime = time !== undefined ? time : now();
		this._startTime += _delayTime;

		for (const property in this._valuesEnd) {
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

			if ((this._valuesStart[property] instanceof Array) === false) {
				this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
		}

		return this;
	}

	stop() {
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

	stopChainedTweens() {
		const { _chainedTweens } = this;

		for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}
	}

	delay(amount) {
		this._delayTime = amount;
		return this;
	}

	repeat(times) {
		this._repeat = times;
		return this;
	}

	yoyo(yoyo) {
		this._yoyo = yoyo;
		return this;
	}

	easing(easing) {
		this._easingFunction = easing;
		return this;
	}

	interpolation(interpolation) {
		this._interpolationFunction = interpolation;
		return this;
	}

	chain(...args) {
		this._chainedTweens = args;
		return this;
	}

	onStart(callback) {
		this._onStartCallback = callback;
		return this;
	}

	onUpdate(callback) {
		this._onUpdateCallback = callback;
		return this;
	}

	onComplete(callback) {
		this._onCompleteCallback = callback;
		return this;
	}

	onStop(callback) {
		this._onStopCallback = callback;
		return this;
	}

	update(time) {
		let property;
		let elapsed;
		const { _onUpdateCallback,
			_chainedTweens,
			_onStartCallback,
			_object,
			_interpolationFunction,
			_valuesStartRepeat,
			_valuesEnd,
			_valuesStart,
			_onCompleteCallback,
			_duration,
			_delayTime } = this;


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

		const value = this._easingFunction(elapsed);

		for (property in this._valuesEnd) {
			// Don't update properties that do not exist in the source object
			if (this._valuesStart[property] === undefined) {
				continue;
			}

			const start = this._valuesStart[property] || 0;
			let end = this._valuesEnd[property];

			if (end instanceof Array) {
				_object[property] = _interpolationFunction(end, value);
			} else {
				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {
					if (end.startsWith('+') || end.startsWith('-')) {
						end = start + parseFloat(end, 10);
					} else {
						end = parseFloat(end, 10);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
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
					if (typeof (this._valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
					}

					if (this._yoyo) {
						const tmp = _valuesStartRepeat[property];

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

			for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
				// Make the chained tweens start exactly at the time they should,
				// even if the `update()` method was called way past the duration of the tween
				_chainedTweens[i].start(this._startTime + _duration);
			}

			return false;
		}

		return true;
	}
}
