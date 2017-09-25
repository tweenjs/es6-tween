import { add, now, remove } from './core';
import Easing from './Easing';
import Interpolation from './Interpolation';

let _id = 0; // Unique ID

/**
 * Tween Lite main constructor
 * @constructor
 * @class
 * @namespace Lite
 * @param {object} object initial object
 * @example
 * import {Tween} from 'es6-tween/src/Tween.Lite'
 *
 * let tween = new Tween({x:0}).to({x:100}, 2000).start()
 */
class Lite {
  public id: number;
  public object: Object;
  public _valuesStart: Object;
  public _valuesStartRepeat: Object;
  public _valuesEnd: Object;
  public _duration: number;
  public _easingFunction: Function;
  public _interpolationFunction: Function;
  public _startTime: number;
  public _delayTime: number;
  public _reverseDelayTime: number;
  public _repeat: number;
  public _yoyo: boolean;
  public _onStartCallback: Function;
  public _onUpdateCallback: Function;
  public _onCompleteCallback: Function;
  public _pausedTime: number;
  private _r: number;
  private _reversed: boolean;
  private _onStartCallbackFired: boolean;
  private _isFinite: boolean;
  private _isPlaying: boolean;
  constructor(object: Object) {
    this.id = _id++;
    this.object = object;
    this._valuesStart = {};
    this._valuesEnd = null;
    this._valuesStartRepeat = {};

    this._duration = 1000;
    this._easingFunction = Easing.Linear.None;
    this._interpolationFunction = Interpolation.Linear;

    this._startTime = 0;
    this._delayTime = 0;
    this._repeat = 0;
    this._r = 0;
    this._isPlaying = false;
    this._yoyo = false;
    this._reversed = false;

    this._onStartCallbackFired = false;
    this._pausedTime = null;
    this._isFinite = true;

    /* Callbacks */
    this._onStartCallback = null;
    this._onUpdateCallback = null;
    this._onCompleteCallback = null;

    return this;
  }

  /**
   * onStart callback
   * @param {Function} callback Function should be fired after tween is started
   * @example tween.onStart(object => console.log(object))
   * @memberof Lite
   */
  public onStart(callback: Function) {
    this._onStartCallback = callback;

    return this;
  }

  /**
   * onUpdate callback
   * @param {Function} callback Function should be fired while tween is in progress
   * @example tween.onUpdate(object => console.log(object))
   * @memberof Lite
   */
  public onUpdate(callback: Function) {
    this._onUpdateCallback = callback;

    return this;
  }

  /**
   * onComplete callback
   * @param {Function} callback Function should be fired after tween is finished
   * @example tween.onComplete(object => console.log(object))
   * @memberof Lite
   */
  public onComplete(callback: Function) {
    this._onCompleteCallback = callback;

    return this;
  }

  /**
   * @return {boolean} State of playing of tween
   * @example tween.isPlaying() // returns `true` if tween in progress
   * @memberof Lite
   */
  public isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * @return {boolean} State of started of tween
   * @example tween.isStarted() // returns `true` if tween in started
   * @memberof Lite
   */
  public isStarted(): boolean {
    return this._onStartCallbackFired;
  }

  /**
   * Pauses tween
   * @example tween.pause()
   * @memberof Lite
   */
  public pause() {
    if (!this._isPlaying) {
      return this;
    }

    this._isPlaying = false;

    remove(this);
    this._pausedTime = now();

    return this;
  }

  /**
   * Play/Resume the tween
   * @example tween.play()
   * @memberof Lite
   */
  public play() {
    if (this._isPlaying) {
      return this;
    }

    this._isPlaying = true;

    this._startTime += now() - this._pausedTime;
    add(this);
    this._pausedTime = now();

    return this;
  }

  /**
   * Sets tween duration
   * @param {number} amount Duration is milliseconds
   * @example tween.duration(2000)
   * @memberof Lite
   */
  public duration(amount: number) {
    this._duration =
      typeof amount === 'function' ? amount(this._duration) : amount;

    return this;
  }

  /**
   * Sets target value and duration
   * @param {object} properties Target value (to value)
   * @param {number} [duration=1000] Duration of tween
   * @example new Tween({x:0}).to({x:200}, 2000)
   * @memberof Lite
   */
  public to(properties: Object, duration: number = 1000) {
    this._valuesEnd = properties;

    this._duration = duration;

    return this;
  }

  /**
   * Start the tweening
   * @param {number|string} time setting manual time instead of Current browser timestamp or like `+1000` relative to current timestamp
   * @example tween.start()
   * @memberof Tween
   */
  public start(time?: number) {
    this._startTime =
      time !== undefined
        ? typeof time === 'string' ? now() + parseFloat(time) : time
        : now();
    this._startTime += this._delayTime;

    const {
      _valuesEnd,
      _valuesStartRepeat,
      _valuesStart,
      _interpolationFunction,
      object,
    } = this;

    for (const property in _valuesEnd) {
      const start = object[property];
      let end = _valuesEnd[property];

      if (!object || object[property] === undefined) {
        continue;
      }

      const obj = object[property];

      if (typeof start === 'number') {
        if (typeof end === 'string') {
          _valuesStartRepeat[property] = end;
          end = start + parseFloat(end);
        } else if (Array.isArray(end)) {
          end.unshift(start);
          const _endArr = end;
          end = t => {
            return _interpolationFunction(_endArr, t);
          };
        }
      } else if (typeof end === 'object') {
        if (Array.isArray(end)) {
          const _endArr = end;
          const _start = start.map(item => item);
          let i;
          const len = end.length;
          end = t => {
            i = 0;
            for (; i < len; i++) {
              obj[i] =
                typeof _start[i] === 'number'
                  ? _start[i] + (_endArr[i] - _start[i]) * t
                  : _endArr[i];
            }
            return obj;
          };
        } else {
          const _endObj = end;
          const _start = {};
          for (const p in start) {
            _start[p] = start[p];
          }
          end = t => {
            for (const i in end) {
              obj[i] =
                typeof _start[i] === 'number'
                  ? _start[i] + (_endObj[i] - _start[i]) * t
                  : _endObj[i];
            }
            return obj;
          };
        }
      }

      _valuesStart[property] = start;
      _valuesEnd[property] = end;
    }

    this._isPlaying = true;
    this._reversed = false;
    this._onStartCallbackFired = false;

    add(this);

    return this;
  }

  /**
   * Stops the tween
   * @example tween.stop()
   * @memberof Lite
   */
  public stop() {
    let {
      _isPlaying,
      _isFinite,
      object,
      _startTime,
      _delayTime,
      _duration,
      _r,
    } = this;

    if (!_isPlaying || !_isFinite) {
      return this;
    }

    let atEnd = (_r + 1) % 2 === 1;

    if (atEnd) {
      this.update(_startTime + _duration);
    } else {
      this.update(_startTime);
    }
    remove(this);

    return this;
  }

  /**
   * Set delay of tween
   * @param {number} amount Sets tween delay / wait duration
   * @example tween.delay(500)
   * @memberof Lite
   */
  public delay(amount: number) {
    this._delayTime =
      typeof amount === 'function' ? amount(this._delayTime) : amount;

    return this;
  }

  /**
   * Sets how times tween is repeating
   * @param {amount} amount the times of repeat
   * @example tween.repeat(2)
   * @memberof Lite
   */
  public repeat(amount: number) {
    this._repeat = typeof amount === 'function' ? amount(this._repeat) : amount;
    this._r = this._repeat;
    this._isFinite = isFinite(amount);

    return this;
  }

  /**
   * Set delay of each repeat alternate of tween
   * @param {number} amount Sets tween repeat alternate delay / repeat alternate wait duration
   * @example tween.reverseDelay(500)
   * @memberof Lite
   */
  public reverseDelay(amount: number) {
    this._reverseDelayTime =
      typeof amount === 'function' ? amount(this._reverseDelayTime) : amount;

    return this;
  }

  /**
   * Set `yoyo` state (enables reverse in repeat)
   * @param {boolean} state Enables alternate direction for repeat
   * @example tween.yoyo(true)
   * @memberof Lite
   */
  public yoyo(state: boolean) {
    this._yoyo = typeof state === 'function' ? state(this._yoyo) : state;
    if (!state) {
      this._reversed = false;
    }

    return this;
  }

  /**
   * Set easing
   * @param {Function} _easingFunction Easing function
   * @example tween.easing(Easing.Quadratic.InOut)
   * @memberof Lite
   */
  public easing(fn: Function) {
    if (typeof fn === 'function') {
      this._easingFunction = fn;
    }

    return this;
  }

  /**
   * Set interpolation
   * @param {Function} _interpolationFunction Interpolation function
   * @example tween.interpolation(Interpolation.Bezier)
   * @memberof Lite
   */
  public interpolation(_interpolationFunction: Function) {
    if (typeof _interpolationFunction === 'function') {
      this._interpolationFunction = _interpolationFunction;
    }

    return this;
  }

  /**
   * Updates initial object to target value by given `time`
   * @param {Time} time Current time
   * @param {boolean=} preserve Prevents from removing tween from store
   * @example tween.update(500)
   * @memberof Lite
   */
  public update(time: number, preserve?: boolean) {
    const {
      _onStartCallbackFired,
      _easingFunction,
      _repeat,
      _delayTime,
      _reverseDelayTime,
      _yoyo,
      _reversed,
      _startTime,
      _duration,
      _valuesStart,
      _valuesEnd,
      _valuesStartRepeat,
      object,
      _isFinite,
      _isPlaying,
      _onStartCallback,
      _onUpdateCallback,
      _onCompleteCallback,
    } = this;

    let elapsed: number;
    let value: number;
    let property: string;

    time = time !== undefined ? time : now();

    if (!_isPlaying || time < _startTime) {
      return true;
    }

    if (!_onStartCallbackFired) {
      if (_onStartCallback) {
        _onStartCallback(object);
      }

      this._onStartCallbackFired = true;
    }

    elapsed = (time - _startTime) / _duration;
    elapsed = elapsed > 1 ? 1 : elapsed;
    elapsed = _reversed ? 1 - elapsed : elapsed;

    value = _easingFunction(elapsed);

    for (property in _valuesEnd) {
      const start: any = _valuesStart[property];
      const end: any = _valuesEnd[property];

      if (start === undefined) {
        continue;
      } else if (typeof end === 'function') {
        object[property] = end(value);
      } else if (typeof end === 'number') {
        object[property] = start + (end - start) * value;
      }
    }

    if (_onUpdateCallback) {
      _onUpdateCallback(object, elapsed);
    }

    if (elapsed === 1 || (_reversed && elapsed === 0)) {
      if (_repeat) {
        if (_isFinite) {
          this._repeat--;
        }

        if (!_reversed) {
          for (property in _valuesStartRepeat) {
            _valuesStart[property] = _valuesEnd[property];
            _valuesEnd[property] += parseFloat(_valuesStartRepeat[property]);
          }
        }

        if (_yoyo) {
          this._reversed = !_reversed;
        }

        if (_reversed && _reverseDelayTime) {
          this._startTime = time + _reverseDelayTime;
        } else {
          this._startTime = time + _delayTime;
        }

        return true;
      } else {
        if (!preserve) {
          this._isPlaying = false;
          remove(this);
        }
        if (_onCompleteCallback) {
          _onCompleteCallback();
        }
        this._repeat = this._r;
        _id--;

        return false;
      }
    }

    return true;
  }
}

export default Lite;
