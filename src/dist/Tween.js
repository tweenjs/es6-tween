import {
	add,
	remove,
	now
}
from './core';
import Easing from './Easing';
import Interpolation from './Interpolation';
import cloneTween from './clone';
import joinToString from './joinToString';
import toNumber from './toNumber';

// Credits:
// @jkroso for string parse library
// Optimized, Extended by @dalisoft
const Number_Match_RegEx = /\s+|([A-Za-z?().,{}:""\[\]#]+)|([-+\/*%]+=)?([-+*\/%]+)?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/gi;

class Tween {
	constructor(object = {}) {

		this.object = object;
		this._valuesStart = Tween.createEmptyConst(object);
		this._valuesEnd = Tween.createEmptyConst(object);
		this._chainedTweens = [];

		this._duration = 1000;
		this._easingFunction = Easing.Linear.None;
		this._interpolationFunction = Interpolation.None;

		this._startTime = 0;
		this._delayTime = 0;
		this._repeat = 0;
		this._r = 0;
		this._isPlaying = false;
		this._yoyo = false;
		this._reversed = false;

		this._onStartCallbackFired = false;
		this._events = {};
		this._pausedTime = 0;

		return this;

	}
	static createEmptyConst(oldObject) {
		return typeof(oldObject) === "number" ? 0 : Array.isArray(oldObject) ? [] : typeof(oldObject) === "object" ? {}
		 : '';
	}
	static checkValidness(valid) {
		return valid !== undefined && valid !== null && valid !== '' && valid !== NaN && valid !== Infinity;
	}
	isPlaying() {
		return this._isPlaying;
	}
	isStarted() {
		return this._onStartCallbackFired;
	}
	reverse() {

		const {
			_reversed
		} = this;

		this._reversed = !_reversed;

		return this;
	}
	reversed() {
		return this._reversed;
	}
	off(name, fn) {
		if (this._events[name] === undefined) {
			return this;
		}
		if (name !== undefined && fn !== undefined) {
			let eventsList = this._events[name],
			i = 0;
			while (i < eventsList.length) {
				if (eventsList[i] === fn) {
					eventsList.splice(i, 1);
				}
				i++;
			}
		} else if (name !== undefined && fn === undefined) {
			this._events[name] = [];
		}
		return this;
	}
	on(name, fn) {
		if (this._events[name] === undefined) {
			this._events[name] = [];
		}
		this._events[name].push(fn);
		return this;
	}
	once(name, fn) {
		if (this._events[name] === undefined) {
			this._events[name] = [];
		}
		return this.on(name, (...args) => {
			fn.call(this, ...args);
			this.off(name);
		});
	}
	emit(name, a, b, c, d, e) {

		let {
			_events
		} = this;

		let eventFn = _events[name];

		if (!eventFn) {
			return this;
		}

		let i = eventFn.length;
		while (i--) {
			eventFn[i].call(this, a, b, c, d, e);
		}
		return this;

	}
	pause() {

		if (!this._isPlaying) {
			return this;
		}

		this._isPlaying = false;

		remove(this);
		this._pausedTime = now();

		return this.emit('pause', this.object);
	}
	play() {

		if (this._isPlaying) {
			return this;
		}

		this._isPlaying = true;

		this._startTime += now() - this._pausedTime;
		add(this);
		this._pausedTime = now();

		return this.emit('play', this.object);
	}
	restart(noDelay) {

		this._repeat = this._r;
		this._startTime = now() + (noDelay ? 0 : this._delayTime);

		if (!this._isPlaying) {
			add(this);
		}

		return this.emit('restart', this._object);

	}
	seek(time, keepPlaying) {

		this._startTime = now() + Math.max(0, Math.min(
					time, this._duration));

		this.emit('seek', time, this._object);

		return keepPlaying ? this : this.pause();

	}
	duration(amount) {

		this._duration = typeof(amount) === "function" ? amount(this._duration) : amount;

		return this;
	}
	to(properties = {}, duration = 1000) {

		if (typeof properties === "number") {
			let _vE = {
				Number: properties
			};
			this._valuesEnd = _vE;
		} else {
			this._valuesEnd = properties;
		}

		if (typeof duration === "number") {
			this._duration = typeof(duration) === "function" ? duration(this._duration) : duration;
		} else if (typeof duration === "object") {
			for (let prop in duration) {
				this[prop](typeof duration[prop] === "function" ? duration[prop](this._duration) : duration);
			}
		}

		return this;

	}
	start(time) {

		let {
			_startTime,
			_delayTime,
			_valuesEnd,
			_valuesStart,
			object
		} = this;

		_startTime = time !== undefined ? time : now();
		_startTime += _delayTime;

		this._startTime = _startTime;

		for (let property in _valuesEnd) {

			if (typeof _valuesEnd[property] === "object") {
				if (Array.isArray(_valuesEnd[property])) {
					if (typeof object[property] === "number") {
						this._valuesEnd[property] = [object[property]].concat(_valuesEnd[property]);
					} else {
						let clonedTween = cloneTween(this, {
								object: object[property],
								_valuesEnd: _valuesEnd[property],
								_events: {}
							})
							.start()
							.stop();

						this._valuesEnd[property] = clonedTween;
					}
				} else {
					let clonedTween = cloneTween(this, {
							object: object[property],
							_valuesEnd: _valuesEnd[property],
							_events: {}
						})
						.start()
						.stop();

					this._valuesStart[property] = 1;
					this._valuesEnd[property] = clonedTween;
				}
			} else if (typeof _valuesEnd[property] === "string" && typeof object[property] === "string" && Number_Match_RegEx.test(object[property]) && Number_Match_RegEx.test(_valuesEnd[property])) {

				let __get__Start = object[property].match(Number_Match_RegEx);
				__get__Start = __get__Start.map(toNumber);
				let __get__End = _valuesEnd[property].match(Number_Match_RegEx);
				__get__End = __get__End.map(toNumber);
				let clonedTween = cloneTween(this, {
						object: __get__Start,
						_valuesEnd: __get__End,
						_events: {}
					})
					.start()
					.stop();

				clonedTween.join = true; // For string tweening
				this._valuesStart[property] = 1;
				this._valuesEnd[property] = clonedTween;

			}

			// If value presented as function,
			// we should convert to value again by passing function
			if (typeof object[property] === "function") {
				object[property] = this.object[property] = object[property](this);
			}

			if (typeof _valuesEnd[property] === "function") {
				this._valuesEnd[property] = _valuesEnd[property](this);
			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (Tween.checkValidness(object[property]) === false) {
				continue;
			}

			// If duplicate or non-tweening numerics matched,
			// we should skip from adding to _valuesStart
			if (object[property] === _valuesEnd[property]) {
				continue;
			}

			this._valuesStart[property] = object[property];

		}

		add(this);

		this._isPlaying = true;

		return this;

	}
	stop() {

		let {
			_isPlaying,
			object
		} = this;

		if (!_isPlaying) {
			return this;
		}

		remove(this);
		this._isPlaying = false;

		this.stopChainedTweens();
		return this.emit('stop', object);

	}
	end() {

		const {
			_startTime,
			_duration
		} = this;

		return this.update(_startTime + _duration);

	}
	stopChainedTweens() {

		let {
			_chainedTweens
		} = this;

		_chainedTweens.map(item => item.stop());

		return this;

	}
	delay(amount) {

		this._delayTime = typeof(amount) === "function" ? amount(this._delayTime) : amount;

		return this;

	}
	repeat(amount) {

		this._repeat = typeof(amount) === "function" ? amount(this._repeat) : amount;
		this._r = this._repeat;

		return this;

	}
	repeatDelay(amount) {

		this._repeatDelayTime = typeof(amount) === "function" ? amount(this._repeatDelayTime) : amount;

		return this;

	}
	reverseDelay(amount) {

		this._reverseDelayTime = typeof(amount) === "function" ? amount(this._reverseDelayTime) : amount;

		return this;

	}
	yoyo(state) {

		this._yoyo = typeof(state) === "function" ? state(this._yoyo) : state;

		return this;

	}
	easing(fn) {

		this._easingFunction = fn;

		return this;

	}
	interpolation(fn) {

		this._interpolationFunction = fn;

		return this;

	}
	chain(...args) {

		this._chainedTweens = args;

		return this;

	}
	get(time) {
		this.update(time);
		return this.object;
	}
	update(time) {

		let {
			_onStartCallbackFired,
			_chainedTweens,
			_easingFunction,
			_interpolationFunction,
			_repeat,
			_repeatDelayTime,
			_reverseDelayTime,
			_delayTime,
			_yoyo,
			_reversed,
			_startTime,
			_duration,
			_valuesStart,
			_valuesEnd,
			object
		} = this;

		let property;
		let elapsed;
		let value;

		time = time !== undefined ? time : now();

		if (time < _startTime) {
			return true;
		}

		if (!_onStartCallbackFired) {

			this.emit('start', object);

			this._onStartCallbackFired = true;
		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;
		elapsed = _reversed ? 1 - elapsed : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			let start = _valuesStart[property];
			let end = _valuesEnd[property];

			if (end instanceof Tween) {

				let getValue = end.get(time);

				if (end.join) {

					object[property] = joinToString(getValue);

				} else {

				object[property] = getValue;

				}

			} else if (Array.isArray(end)) {

				object[property] = _interpolationFunction(end, value);

			} else if (typeof(end) === 'string') {

				if (end.charAt(0) === '+' || end.charAt(0) === '-') {
					end = start + parseFloat(end);
				} else {
					end = parseFloat(end);
				}

				// Protect against non numeric properties.
				if (typeof(end) === 'number') {
					object[property] = start + (end - start) * value;
				}
			} else if (typeof(end) === 'number') {
				object[property] = start + (end - start) * value;
			}

		}

		this.emit('update', object, value, elapsed);

		if (elapsed === 1 || (_reversed && elapsed === 0)) {

			if (_repeat) {

				if (isFinite(_repeat)) {
					this._repeat--;
				}

				for (property in _valuesEnd) {

					if (typeof(_valuesEnd[property]) === 'string' && typeof(_valuesStart[property]) === 'number') {
						this._valuesStart[property] = _valuesStart[property] + parseFloat(_valuesEnd[property]);
					}

				}

				// Reassign starting values, restart by making startTime = now
				this.emit(_reversed ? 'reverse' : 'repeat', object);

				if (_yoyo) {
					this._reversed = !_reversed;
				}

				if (!_reversed && _repeatDelayTime) {
					this._startTime += _duration + _repeatDelayTime;
				} else if (_reversed && _reverseDelayTime) {
					this._startTime += _duration + _reverseDelayTime;
				} else {
					this._startTime += _duration;
				}

				return true;

			} else {

				this.emit('complete', object);

				_chainedTweens.map(tween => tween.start(_startTime + _duration));

				return false;

			}
		}
		return true;
	}
}

export default Tween;
