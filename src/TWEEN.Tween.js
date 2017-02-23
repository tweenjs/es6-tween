let Tween = class {
		constructor ( object = {} ) {
			this.object = object;
			this._valuesStart = Object.assign({}, object);
			this._valuesEnd = {};
			this._duration = 1000;
			this._easingFunction = null;
			this._startTime = null;
			this._onUpdate = null;
			this._repeat = 0;
			return this;
		}
		easing ( fn ) {
			this._easingFunction = fn;
			return this;
		}
		onUpdate ( fn ) {
			this._onUpdate = fn;
			return this;
		}
		to ( properties = {}, duration = 1000 ) {
			this._valuesEnd = properties;
			this._duration = duration;
			return this;
		}
		start ( time ) {
			this._startTime = time !== undefined ? time : TWEEN.now();
			TWEEN.add(this);
			return this;
		}
		update(time) {

			let {
				_onUpdate,
				_easingFunction,
				_repeat,
				_startTime,
				_duration,
				_valuesStart,
				_valuesEnd,
				object
			} = this;

			if (time < _startTime) {
				return true;
			}

			let elapsed = (time - _startTime) / _duration;
			elapsed = elapsed > 1 ? 1 : elapsed;
			if (_easingFunction) {
				elapsed = _easingFunction(elapsed);
			}

			for (let property in _valuesEnd) {

				const start = _valuesStart[property];
				const end = _valuesEnd[property];

				if (typeof(end) === "number") {
					object[property] = start + (end - start) * elapsed;
				}

			}

			if (_onUpdate) {
				_onUpdate(object, elapsed);
			}

			if (elapsed === 1) {
				if (_repeat) {
					if (isFinite(_repeat)) {
					_repeat--;
					}
					return true;
				} else {
					
					return false;
				}
			}
			return true;
		}
}

export default Tween;
