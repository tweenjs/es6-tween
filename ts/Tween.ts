import { add, now, Plugins, remove } from './core';
import Easing from './Easing';
import Interpolation from './Interpolation';
import NodeCache, { Store } from './NodeCache';
import Selector from './selector';
import {
  decompose,
  decomposeString,
  recompose,
  deepCopy,
  SET_NESTED,
  STRING_PROP,
  EVENT_CALLBACK,
  CHAINED_TWEENS,
  EVENT_UPDATE,
  EVENT_COMPLETE,
  EVENT_START,
  EVENT_REPEAT,
  EVENT_REVERSE,
  EVENT_PAUSE,
  EVENT_PLAY,
  EVENT_RESTART,
  EVENT_STOP,
  EVENT_SEEK,
  FRAME_MS,
  TOO_LONG_FRAME_MS,
  DECIMAL,
} from './constants';

let _id = 0; // Unique ID
const defaultEasing = Easing.Linear.None;

export interface Params {
  quickRender?: boolean;
}

/**
 * Tween main constructor
 * @constructor
 * @class
 * @namespace TWEEN.Tween
 * @param {Object|Element} node Node Element or Tween initial object
 * @param {Object=} object If Node Element is using, second argument is used for Tween initial object
 * @example let tween = new Tween(myNode, {width:'100px'}).to({width:'300px'}, 2000).start()
 */
class Tween {
  public id: number;
  public object: Object;
  public _valuesStart: Object;
  public _valuesEnd: Object;
  public _duration: number;
  public _easingFunction: Function;
  public _easingReverse: Function;
  public _interpolationFunction: Function;
  public _startTime: number;
  public _initTime: number;
  public _delayTime: number;
  public _reverseDelayTime: number;
  public _repeat: number;
  public _yoyo: boolean;
  public _pausedTime: number;
  public node: any;
  public _r: number;
  public _reversed: boolean;
  public _isFinite: boolean;
  public _isPlaying: boolean;
  public elapsed: number;
  public _prevTime: number;
  private _onStartCallbackFired: boolean;
  private _rendered: boolean;
  private __render: boolean;
  public static Renderer: any;
  private InitialValues: any;
  private _maxListener: number;
  private _chainedTweensCount: number = 0;
  /**
   * Easier way to call the Tween
   * @param {Element} node DOM Element
   * @param {object} object - Initial value
   * @param {object} to - Target value
   * @param {object} params - Options of tweens
   * @example Tween.fromTo(node, {x:0}, {x:200}, {duration:1000})
   * @memberof TWEEN.Tween
   * @static
   */
  public static fromTo(node, object, to, params: Params = {}) {
    params.quickRender = params.quickRender ? params.quickRender : !to;
    const tween = new Tween(node, object).to(to, params);
    if (params.quickRender) {
      tween.render().update(tween._startTime);
      tween._rendered = false;
      tween._onStartCallbackFired = false;
    }
    return tween;
  }
  /**
   * Easier way calling constructor only applies the `to` value, useful for CSS Animation
   * @param {Element} node DOM Element
   * @param {object} to - Target value
   * @param {object} params - Options of tweens
   * @example Tween.to(node, {x:200}, {duration:1000})
   * @memberof TWEEN.Tween
   * @static
   */
  public static to(node, to, params) {
    return Tween.fromTo(node, null, to, params);
  }
  /**
   * Easier way calling constructor only applies the `from` value, useful for CSS Animation
   * @param {Element} node DOM Element
   * @param {object} from - Initial value
   * @param {object} params - Options of tweens
   * @example Tween.from(node, {x:200}, {duration:1000})
   * @memberof TWEEN.Tween
   * @static
   */
  public static from(node, from, params) {
    return Tween.fromTo(node, from, null, params);
  }
  constructor(node?: any, object?: Object) {
    this.id = _id++;
    if (!!node && typeof node === 'object' && !object && !node.nodeType) {
      object = this.object = node;
      node = null;
    } else if (
      !!node &&
      (node.nodeType || node.length || typeof node === 'string')
    ) {
      node = this.node = Selector(node);
      object = this.object = NodeCache(node, object, this);
    }
    this._valuesEnd = null;
    this._valuesStart = {};

    this._duration = 1000;
    this._easingFunction = defaultEasing;
    this._easingReverse = defaultEasing;
    this._interpolationFunction = Interpolation.Linear;

    this._startTime = 0;
    this._initTime = 0;
    this._delayTime = 0;
    this._repeat = 0;
    this._r = 0;
    this._isPlaying = false;
    this._yoyo = false;
    this._reversed = false;

    this._onStartCallbackFired = false;
    this._pausedTime = null;
    this._isFinite = true;
    this._maxListener = 15;
    this._prevTime = null;

    return this;
  }

  /**
   * Sets max `event` listener's count to Events system
   * @param {number} count - Event listener's count
   * @memberof TWEEN.Tween
   */
  setMaxListener(count: number = 15) {
    this._maxListener = count;
    return this;
  }

  /**
   * Adds `event` to Events system
   * @param {string} event - Event listener name
   * @param {Function} callback - Event listener callback
   * @memberof TWEEN.Tween
   */
  public on(event: string, callback: Function) {
    const { _maxListener } = this;
    const callbackName = event + EVENT_CALLBACK;
    for (let i = 0; i < _maxListener; i++) {
      const callbackId = callbackName + i;
      if (!this[callbackId]) {
        this[callbackId] = callback;
        break;
      }
    }
    return this;
  }

  /**
   * Adds `event` to Events system.
   * Removes itself after fired once
   * @param {string} event - Event listener name
   * @param {Function} callback - Event listener callback
   * @memberof TWEEN.Tween
   */
  public once(event: string, callback: Function) {
    const { _maxListener } = this;
    const callbackName = event + EVENT_CALLBACK;
    for (let i = 0; i < _maxListener; i++) {
      const callbackId = callbackName + i;
      if (!this[callbackId]) {
        this[callbackId] = (...args) => {
          callback.apply(this, args);
          this[callbackId] = null;
        };
        break;
      }
    }
    return this;
  }

  /**
   * Removes `event` from Events system
   * @param {string} event - Event listener name
   * @param {Function} callback - Event listener callback
   * @memberof TWEEN.Tween
   */
  public off(event: string, callback: Function) {
    const { _maxListener } = this;
    const callbackName = event + EVENT_CALLBACK;
    for (let i = 0; i < _maxListener; i++) {
      const callbackId = callbackName + i;
      if (this[callbackId] === callback) {
        this[callbackId] = null;
      }
    }
    return this;
  }

  /**
   * Emits/Fired/Trigger `event` from Events system listeners
   * @param {string} event - Event listener name
   * @memberof TWEEN.Tween
   */
  public emit(event: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
    const { _maxListener } = this;
    const callbackName = event + EVENT_CALLBACK;

    if (!this[callbackName + 0]) {
      return this;
    }
    for (let i = 0; i < _maxListener; i++) {
      const callbackId = callbackName + i;
      if (this[callbackId]) {
        this[callbackId](arg1, arg2, arg3, arg4);
      }
    }
    return this;
  }

  /**
   * @return {boolean} State of playing of tween
   * @example tween.isPlaying() // returns `true` if tween in progress
   * @memberof TWEEN.Tween
   */
  public isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * @return {boolean} State of started of tween
   * @example tween.isStarted() // returns `true` if tween in started
   * @memberof TWEEN.Tween
   */
  public isStarted(): boolean {
    return this._onStartCallbackFired;
  }

  /**
   * Reverses the tween state/direction
   * @example tween.reverse()
   * @param {boolean=} state Set state of current reverse
   * @memberof TWEEN.Tween
   */
  public reverse(state?: boolean) {
    const { _reversed } = this;

    this._reversed = state !== undefined ? state : !_reversed;

    return this;
  }

  /**
   * @return {boolean} State of reversed
   * @example tween.reversed() // returns `true` if tween in reversed state
   * @memberof TWEEN.Tween
   */
  public reversed(): boolean {
    return this._reversed;
  }

  /**
   * Pauses tween
   * @example tween.pause()
   * @memberof TWEEN.Tween
   */
  public pause() {
    if (!this._isPlaying) {
      return this;
    }

    this._isPlaying = false;

    remove(this);
    this._pausedTime = now();

    return this.emit(EVENT_PAUSE, this.object);
  }

  /**
   * Play/Resume the tween
   * @example tween.play()
   * @memberof TWEEN.Tween
   */
  public play() {
    if (this._isPlaying) {
      return this;
    }

    this._isPlaying = true;

    this._startTime += now() - this._pausedTime;
    this._initTime = this._startTime;
    add(this);
    this._pausedTime = now();

    return this.emit(EVENT_PLAY, this.object);
  }

  /**
   * Restarts tween from initial value
   * @param {boolean=} noDelay If this param is set to `true`, restarts tween without `delay`
   * @example tween.restart()
   * @memberof TWEEN.Tween
   */
  public restart(noDelay?: boolean) {
    this._repeat = this._r;
    this.reassignValues();

    add(this);

    return this.emit(EVENT_RESTART, this.object);
  }

  /**
   * Seek tween value by `time`. Note: Not works as excepted. PR are welcome
   * @param {Time} time Tween update time
   * @param {boolean=} keepPlaying When this param is set to `false`, tween pausing after seek
   * @example tween.seek(500)
   * @memberof TWEEN.Tween
   * @deprecated Not works as excepted, so we deprecated this method
   */
  public seek(time: number, keepPlaying?: boolean) {
    const {
      _duration,
      _repeat,
      _initTime,
      _startTime,
      _delayTime,
      _reversed,
    } = this;

    let updateTime: number = _initTime + time;
    this._isPlaying = true;

    if (updateTime < _startTime && _startTime >= _initTime) {
      this._startTime -= _duration;
      this._reversed = !_reversed;
    }

    this.update(time, false);

    this.emit(EVENT_SEEK, time, this.object);

    return keepPlaying ? this : this.pause();
  }

  /**
   * Sets tween duration
   * @param {number} amount Duration is milliseconds
   * @example tween.duration(2000)
   * @memberof TWEEN.Tween
   */
  public duration(amount: number) {
    this._duration =
      typeof amount === 'function' ? amount(this._duration) : amount;

    return this;
  }

  /**
   * Sets target value and duration
   * @param {object} properties Target value (to value)
   * @param {number|Object=} [duration=1000] Duration of tween
   * @example let tween = new Tween({x:0}).to({x:100}, 2000)
   * @memberof TWEEN.Tween
   */
  public to(properties: Object, duration: any = 1000, maybeUsed?: any) {
    this._valuesEnd = properties;

    if (typeof duration === 'number' || typeof duration === 'function') {
      this._duration =
        typeof duration === 'function' ? duration(this._duration) : duration;
    } else if (typeof duration === 'object') {
      for (const prop in duration) {
        if (typeof this[prop] === 'function') {
          const [
            arg1 = null,
            arg2 = null,
            arg3 = null,
            arg4 = null,
          ] = Array.isArray(duration[prop]) ? duration[prop] : [duration[prop]];
          this[prop](arg1, arg2, arg3, arg4);
        }
      }
    }

    return this;
  }

  /**
   * Renders and computes value at first render
   * @private
   * @memberof TWEEN.Tween
   */
  public render() {
    if (this._rendered) {
      return this;
    }
    let {
      _valuesStart,
      _valuesEnd,
      object,
      node,
      InitialValues,
      _easingFunction,
    } = this;

    SET_NESTED(object);
    SET_NESTED(_valuesEnd);

    if (node && node.queueID && Store[node.queueID]) {
      const prevTweenByNode = Store[node.queueID];
      if (
        prevTweenByNode.propNormaliseRequired &&
        prevTweenByNode.tween !== this
      ) {
        for (const property in _valuesEnd) {
          if (prevTweenByNode.tween._valuesEnd[property] !== undefined) {
            //delete prevTweenByNode.tween._valuesEnd[property];
          }
        }
        prevTweenByNode.normalisedProp = true;
        prevTweenByNode.propNormaliseRequired = false;
      }
    }

    if (node && InitialValues) {
      if (!object || Object.keys(object).length === 0) {
        object = this.object = NodeCache(
          node,
          InitialValues(node, _valuesEnd),
          this
        );
      } else if (!_valuesEnd || Object.keys(_valuesEnd).length === 0) {
        _valuesEnd = this._valuesEnd = InitialValues(node, object);
      }
    }
    for (const property in _valuesEnd) {
      let start = object && object[property] && deepCopy(object[property]);
      let end = _valuesEnd[property];
      if (Plugins[property] && Plugins[property].init) {
        Plugins[property].init.call(this, start, end, property, object);
        if (start === undefined && _valuesStart[property]) {
          start = _valuesStart[property];
        }
        if (Plugins[property].skipProcess) {
          continue;
        }
      }
      if (
        (typeof start === 'number' && isNaN(start)) ||
        start === null ||
        end === null ||
        start === false ||
        end === false ||
        start === undefined ||
        end === undefined ||
        start === end
      ) {
        continue;
      }
      if (Array.isArray(end) && !Array.isArray(start)) {
        end.unshift(start);
        for (let i = 0, len = end.length; i < len; i++) {
          if (typeof end[i] === 'string') {
            let arrayOfStrings = decomposeString(end[i]);
			let stringObject = {length: arrayOfStrings.length, isString: true}
			for (let ii = 0, len2 = arrayOfStrings.length; ii < len2; ii++) {
				stringObject[ii] = arrayOfStrings[ii]
			}
            end[i] = stringObject
          }
        }
      }
      _valuesStart[property] = start;
	  if (typeof start === 'number' && typeof end === 'string' && end[1] === '=') {
		  continue
	  }
      decompose(property, object, _valuesStart, _valuesEnd);
    }

    if (Tween.Renderer && this.node && Tween.Renderer.init) {
      Tween.Renderer.init.call(this, object, _valuesStart, _valuesEnd);
      this.__render = true;
    }

    return this;
  }

  /**
   * Start the tweening
   * @param {number|string} time setting manual time instead of Current browser timestamp or like `+1000` relative to current timestamp
   * @example tween.start()
   * @memberof TWEEN.Tween
   */
  public start(time?: number | string) {
    this._startTime =
      time !== undefined
        ? typeof time === 'string' ? now() + parseFloat(time) : time
        : now();
    this._startTime += this._delayTime;
    this._initTime = this._prevTime = this._startTime;

    this._onStartCallbackFired = false;
    this._rendered = false;
    this._isPlaying = true;

    add(this);

    return this;
  }

  /**
   * Stops the tween
   * @example tween.stop()
   * @memberof TWEEN.Tween
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
      _yoyo,
      _reversed,
    } = this;

    if (!_isPlaying) {
      return this;
    }

    let atStart = _isFinite ? (_r + 1) % 2 === 1 : !_reversed;

    this._reversed = false;

    if (_yoyo && atStart) {
      this.update(_startTime);
    } else {
      this.update(_startTime + _duration);
    }
    remove(this);

    return this.emit(EVENT_STOP, object);
  }

  /**
   * Set delay of tween
   * @param {number} amount Sets tween delay / wait duration
   * @example tween.delay(500)
   * @memberof TWEEN.Tween
   */
  public delay(amount: number) {
    this._delayTime =
      typeof amount === 'function' ? amount(this._delayTime) : amount;

    return this;
  }

  /**
   * Chained tweens
   * @param {any} arguments Arguments list
   * @example tween.chainedTweens(tween1, tween2)
   * @memberof TWEEN.Tween
   */
  public chainedTweens() {
    this._chainedTweensCount = arguments.length;
    if (!this._chainedTweensCount) {
      return this;
    }
    for (let i = 0, len = this._chainedTweensCount; i < len; i++) {
      this[CHAINED_TWEENS + i] = arguments[i];
    }

    return this;
  }

  /**
   * Sets how times tween is repeating
   * @param {amount} amount the times of repeat
   * @example tween.repeat(5)
   * @memberof TWEEN.Tween
   */
  public repeat(amount: number) {
    this._repeat = !this._duration
      ? 0
      : typeof amount === 'function' ? amount(this._repeat) : amount;
    this._r = this._repeat;
    this._isFinite = isFinite(amount);

    return this;
  }

  /**
   * Set delay of each repeat alternate of tween
   * @param {number} amount Sets tween repeat alternate delay / repeat alternate wait duration
   * @example tween.reverseDelay(500)
   * @memberof TWEEN.Tween
   */
  public reverseDelay(amount: number) {
    this._reverseDelayTime =
      typeof amount === 'function' ? amount(this._reverseDelayTime) : amount;

    return this;
  }

  /**
   * Set `yoyo` state (enables reverse in repeat)
   * @param {boolean} state Enables alternate direction for repeat
   * @param {Function=} _easingReverse Easing function in reverse direction
   * @example tween.yoyo(true)
   * @memberof TWEEN.Tween
   */
  public yoyo(state: boolean, _easingReverse?: Function) {
    this._yoyo =
      typeof state === 'function'
        ? state(this._yoyo)
        : state === null ? this._yoyo : state;
    if (!state) {
      this._reversed = false;
    }
    this._easingReverse = _easingReverse || null;

    return this;
  }

  /**
   * Set easing
   * @param {Function} _easingFunction Easing function, applies in non-reverse direction if Tween#yoyo second argument is applied
   * @example tween.easing(Easing.Elastic.InOut)
   * @memberof TWEEN.Tween
   */
  public easing(_easingFunction: Function) {
    this._easingFunction = _easingFunction;

    return this;
  }

  /**
   * Set interpolation
   * @param {Function} _interpolationFunction Interpolation function
   * @example tween.interpolation(Interpolation.Bezier)
   * @memberof TWEEN.Tween
   */
  public interpolation(_interpolationFunction: Function) {
    if (typeof _interpolationFunction === 'function') {
      this._interpolationFunction = _interpolationFunction;
    }

    return this;
  }

  /**
   * Reassigns value for rare-case like Tween#restart or for Timeline
   * @private
   * @memberof TWEEN.Tween
   */
  public reassignValues(time?: number) {
    const { _valuesStart, object, _delayTime } = this;

    this._isPlaying = true;
    this._startTime = time !== undefined ? time : now();
    this._startTime += _delayTime;
    this._reversed = false;
    add(this);

    for (const property in _valuesStart) {
      const start = _valuesStart[property];

      object[property] = start;
    }

    return this;
  }

  /**
   * Updates initial object to target value by given `time`
   * @param {Time} time Current time
   * @param {boolean=} preserve Prevents from removing tween from store
   * @param {boolean=} forceTime Forces to be frame rendered, even mismatching time
   * @example tween.update(100)
   * @memberof TWEEN.Tween
   */
  public update(time?: number, preserve?: boolean, forceTime?: boolean) {
    let {
      _onStartCallbackFired,
      _easingFunction,
      _interpolationFunction,
      _easingReverse,
      _repeat,
      _delayTime,
      _reverseDelayTime,
      _yoyo,
      _reversed,
      _startTime,
      _prevTime,
      _duration,
      _valuesStart,
      _valuesEnd,
      object,
      _isFinite,
      _isPlaying,
      __render,
      _chainedTweensCount,
    } = this;

    let elapsed: number;
    let currentEasing: Function;
    let property: string;
    let propCount: number = 0;

    if (!_duration) {
      elapsed = 1;
	  _repeat = 0;
    } else {
      time = time !== undefined ? time : now();

      let delta: number = time - _prevTime;
      this._prevTime = time;
      if (delta > TOO_LONG_FRAME_MS) {
        time -= delta - FRAME_MS;
      }

      if (!_isPlaying || (time < _startTime && !forceTime)) {
        return true;
      }

      elapsed = (time - _startTime) / _duration;
      elapsed = elapsed > 1 ? 1 : elapsed;
      elapsed = _reversed ? 1 - elapsed : elapsed;
    }

    if (!_onStartCallbackFired) {
      if (!this._rendered) {
        this.render();
        this._rendered = true;
      }

      this.emit(EVENT_START, object);

      this._onStartCallbackFired = true;
    }

    currentEasing = _reversed
      ? _easingReverse || _easingFunction
      : _easingFunction;

    if (!object) {
      return true;
    }

    for (property in _valuesEnd) {
      const start = _valuesStart[property];
      if (
        (start === undefined || start === null) &&
        !(Plugins[property] && Plugins[property].update)
      ) {
        continue;
      }
      const end = _valuesEnd[property];
      const value = currentEasing[property]
        ? currentEasing[property](elapsed)
        : typeof currentEasing === 'function'
          ? currentEasing(elapsed)
          : defaultEasing(elapsed);
      const _interpolationFunctionCall = _interpolationFunction[property]
        ? _interpolationFunction[property]
        : typeof _interpolationFunction === 'function'
          ? _interpolationFunction
          : Interpolation.Linear;

      if (typeof end === 'number') {
        object[property] =
          (((start + (end - start) * value) * DECIMAL) | 0) / DECIMAL;
      } else if (Array.isArray(end) && !Array.isArray(start)) {
        object[property] = _interpolationFunctionCall(
          end,
          value,
          object[property]
        );
      } else if (end && end.update) {
        end.update(value);
      } else if (typeof end === 'function') {
        object[property] = end(value);
      } else if (typeof end === 'string' && typeof start === 'number') {
		object[property] = start + parseFloat(end[0] + end.substr(2)) * value
	  } else {
        recompose(property, object, _valuesStart, _valuesEnd, value, elapsed);
      }
      if (Plugins[property] && Plugins[property].update) {
        Plugins[property].update.call(
          this,
          object[property],
          start,
          end,
          value,
          elapsed,
		  property
        );
      }
      propCount++;
    }

    if (!propCount) {
      remove(this);
      return false;
    }

    if (__render && Tween.Renderer && Tween.Renderer.update) {
      Tween.Renderer.update.call(this, object, elapsed);
    }

    this.emit(EVENT_UPDATE, object, elapsed, time);

    if (elapsed === 1 || (_reversed && elapsed === 0)) {
      if (_repeat > 0 && _duration > 0) {
        if (_isFinite) {
          this._repeat--;
        }

        if (_yoyo) {
          this._reversed = !_reversed;
        } else {
		for (property in _valuesEnd) {
			let end = _valuesEnd[property]
			if (typeof end === 'string' && typeof _valuesStart[property] === 'number') {
			_valuesStart[property] += parseFloat(end[0] + end.substr(2))
			}
		}
		}

        this.emit(_yoyo && !_reversed ? EVENT_REVERSE : EVENT_REPEAT, object);

        if (_reversed && _reverseDelayTime) {
          this._startTime = time - _reverseDelayTime;
        } else {
          this._startTime = time + _delayTime;
        }

        return true;
      } else {
        if (!preserve) {
          this._isPlaying = false;
          remove(this);
          _id--;
        }
        this.emit(EVENT_COMPLETE, object);
        this._repeat = this._r;

        if (_chainedTweensCount) {
          for (let i = 0; i < _chainedTweensCount; i++) {
            this[CHAINED_TWEENS + i].start(time + _duration);
          }
        }

        return false;
      }
    }

    return true;
  }
}

export default Tween;
