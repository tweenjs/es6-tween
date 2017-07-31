import Tween from './Tween';
import { now, nextId } from './core';

class Timeline extends Tween {
  constructor(params) {
    super();
    this._totalDuration = 0;
    this._startTime = now();
    this._tweens = {};
    this._elapsed = 0;
    this._id = nextId();
    this._labels = {};
    this._defaultParams = params;

    return this;
  }
  setLabel(name, value) {
    this._labels[name] = this.parsePosition(0, value, 0);
    return this;
  }
  parsePosition(startTime, input, total) {
    let position = startTime + total;

    if (typeof input === "string") {

      for (let label in this._labels) {

        if (input.indexOf(label) === 0) {

          let inp = input.split(label)[1];

          if (inp.length === 0 || (inp[0] === '+' || inp[0] === '-')) {

            position = this._labels[label] + startTime;
            input = input.replace(label, '');

          }

        }

      }

      if (input.indexOf('+') === 0 || input.indexOf('-') === 0) {

        position += parseFloat(input);

      }

    } else if (typeof input === "number") {

      position += input;

    }

    return position;
  }
  map(fn) {
    for (let tween in this._tweens) {
      fn(this._tweens[tween]);
    }
    return this;
  }
  add(tween, position) {

	if (typeof tween === "object" && !(tween instanceof Tween)) {

		tween = new Tween(tween.from, tweens)

	}

    let {
      _defaultParams,
      _totalDuration
    } = this;

    if (_defaultParams) {
      for (let method in _defaultParams) {
        tween[method](_defaultParams[method]);
      }
    }

    tween._startTime = this.parsePosition(0, position, _totalDuration);
	tween._startTime += now();
    this._totalDuration = Math.max(_totalDuration, tween._duration + tween._startTime);
    this._tweens[tween.id] = tween;
    return this;
  }
  restart () {
	this._startTime += now();

	add(this);

	return this.emit('restart');
  }
  easing(easing) {
    return this.map(tween => tween.easing(easing));
  }
  interpolation(interpolation) {
    return this.map(tween => tween.interpolation(interpolation));
  }
  update(time) {
    let {
      _tweens,
      _totalDuration,
      _repeatDelayTime,
      _reverseDelayTime,
      _startTime,
      _reversed,
      _yoyo,
      _repeat
    } = this;

    if (time < _startTime) {

      return true;

    }

    let elapsed = Math.min(1, Math.max(0, (time - _startTime) / _totalDuration));
    elapsed = _reversed ? 1 - elapsed : elapsed;
    this._elapsed = elapsed;

    let timing = time - _startTime;
    let _timing = _reversed ? _totalDuration - timing : timing;

    for (let tween in _tweens) {
	  let _tween = _tweens[tween];
      if (_tween.skip || _tween.update(_timing)) {
        continue;
      } else {
		_tween.skip = true;
	  }
    }

    this.emit('update', elapsed, timing);

    if (elapsed === 1 || (_reversed && elapsed === 0)) {

      if (_repeat) {

        if (isFinite(_repeat)) {
          this._repeat--;
        }

        // Reassign starting values, restart by making startTime = now
        this.emit(_reversed ? 'reverse' : 'repeat');

        if (_yoyo) {
          this._reversed = !_reversed;
        }

        if (!_reversed && _repeatDelayTime) {
          this._startTime += _totalDuration + _repeatDelayTime;
        } else if (_reversed && _reverseDelayTime) {
          this._startTime += _totalDuration + _reverseDelayTime;
        } else {
          this._startTime += _totalDuration;
        }
		
		for (let tween in _tweens) {
			let _tween = _tweens[tween];
			if (_tween.skip) {
				_tween.skip = false;
			}
		}

        return true;

      } else {

        this.emit('complete');
        this._repeat = this._r;

        return false;

      }

    }

    return true;

  }
  elapsed(value) {
    return value !== undefined ? this.update(value * this._totalDuration) : this._elapsed;
  }
  seek (value) {
	return this.update(value < 1.1 ? value * this._totalDuration : value);
  }
}
export default Timeline;