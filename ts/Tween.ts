import InterTween from 'intertween'
import { create } from './shim'
import {
  add,
  now,
  Plugins,
  remove
}
  from './core'
import Easing from './Easing'
import EventClass from './Event'
import NodeCache from './NodeCache'
import Selector from './selector'

Object.create = create

// Events list
export const EVENT_UPDATE = 'update'
export const EVENT_COMPLETE = 'complete'
export const EVENT_START = 'start'
export const EVENT_REPEAT = 'repeat'
export const EVENT_REVERSE = 'reverse'
export const EVENT_PAUSE = 'pause'
export const EVENT_PLAY = 'play'
export const EVENT_RS = 'restart'
export const EVENT_STOP = 'stop'
export const EVENT_SEEK = 'seek'

let _id = 0 // Unique ID
const defaultEasing = Easing.Linear.None

export interface Params {
  quickRender?: boolean
}

export interface RenderType {
  update?: Function
}

/**
 * Tween main constructor
 * @constructor
 * @class
 * @namespace Tween
 * @extends EventClass
 * @param {Object|Element} node Node Element or Tween initial object
 * @param {Object=} object If Node Element is using, second argument is used for Tween initial object
 * @example let tween = new Tween(myNode, {width:'100px'}).to({width:'300px'}, 2000).start()
 */
class Tween extends EventClass {
  public id: number
  public object: Object
  public _valuesEnd: Object
  public _valuesFunc: Function
  public _duration: number
  public _easingFunction: Function
  public _easingReverse: Function
  public _startTime: number
  public _delayTime: number
  public _repeatDelayTime: number
  public _reverseDelayTime: number
  public _repeat: number
  public _yoyo: boolean
  public _pausedTime: number
  public node: any
  public Renderer: any
  public _r: number
  public _reversed: boolean
  public _isFinite: boolean
  public _isPlaying: boolean
  public _elapsed: number
  private _onStartCallbackFired: boolean
  private _rendered: boolean
  private __render: RenderType
  private InitialValues: any
  /**
   * Easier way to call the Tween
   * @param {Element} node DOM Element
   * @param {object} object - Initial value
   * @param {object} to - Target value
   * @param {object} params - Options of tweens
   * @example Tween.fromTo(node, {x:0}, {x:200}, {duration:1000})
   * @memberof Tween
   * @static
   */
  public static fromTo(node, object, to, params: Params = {}) {
    params.quickRender = params.quickRender ? params.quickRender : !to
    const tween = new Tween(node, object).to(to, params)
    if (params.quickRender) {
      tween.render().update(tween._startTime)
      tween._rendered = false
      tween._onStartCallbackFired = false
    }
    return tween
  }
  /**
   * Easier way calling constructor only applies the `to` value, useful for CSS Animation
   * @param {Element} node DOM Element
   * @param {object} to - Target value
   * @param {object} params - Options of tweens
   * @example Tween.to(node, {x:200}, {duration:1000})
   * @memberof Tween
   * @static
   */
  public static to(node, to, params) {
    return Tween.fromTo(node, null, to, params)
  }
  /**
   * Easier way calling constructor only applies the `from` value, useful for CSS Animation
   * @param {Element} node DOM Element
   * @param {object} from - Initial value
   * @param {object} params - Options of tweens
   * @example Tween.from(node, {x:200}, {duration:1000})
   * @memberof Tween
   * @static
   */
  public static from(node, from, params) {
    return Tween.fromTo(node, from, null, params)
  }
  constructor(node?: any, object?: Object) {
    super()

    this.id = _id++
    if (!!node && typeof node === 'object' && !object && !node.nodeType) {
      object = this.object = node
      node = null
    } else if (!!node && (node.nodeType || node.length || typeof node === 'string')) {
      node = this.node = Selector(node)
      object = this.object = NodeCache(node, object)
    }
    this._valuesEnd = null
    this._valuesFunc = null

    this._duration = 1000
    this._easingFunction = defaultEasing
    this._easingReverse = defaultEasing

    this._startTime = 0
    this._delayTime = 0
    this._repeat = 0
    this._r = 0
    this._isPlaying = false
    this._yoyo = false
    this._reversed = false

    this._onStartCallbackFired = false
    this._pausedTime = null
    this._isFinite = true
    this._elapsed = 0

    return this
  }

  /**
   * @return {boolean} State of playing of tween
   * @example tween.isPlaying() // returns `true` if tween in progress
   * @memberof Tween
   */
  public isPlaying(): boolean {
    return this._isPlaying
  }

  /**
   * @return {boolean} State of started of tween
   * @example tween.isStarted() // returns `true` if tween in started
   * @memberof Tween
   */
  public isStarted(): boolean {
    return this._onStartCallbackFired
  }

  /**
   * Reverses the tween state/direction
   * @example tween.reverse()
   * @memberof Tween
   */
  public reverse() {
    const {
      _reversed
    } = this

    this._reversed = !_reversed

    return this
  }

  /**
   * @return {boolean} State of reversed
   * @example tween.reversed() // returns `true` if tween in reversed state
   * @memberof Tween
   */
  public reversed(): boolean {
    return this._reversed
  }

  /**
   * Pauses tween
   * @example tween.pause()
   * @memberof Tween
   */
  public pause() {
    if (!this._isPlaying) {
      return this
    }

    this._isPlaying = false

    remove(this)
    this._pausedTime = now()

    return this.emit(EVENT_PAUSE, this.object)
  }

  /**
   * Play/Resume the tween
   * @example tween.play()
   * @memberof Tween
   */
  public play() {
    if (this._isPlaying) {
      return this
    }

    this._isPlaying = true

    this._startTime += now() - this._pausedTime
    add(this)
    this._pausedTime = now()

    return this.emit(EVENT_PLAY, this.object)
  }

  /**
   * Restarts tween from initial value
   * @param {boolean=} noDelay If this param is set to `true`, restarts tween without `delay`
   * @example tween.restart()
   * @memberof Tween
   */
  public restart(noDelay?: boolean) {
    this._repeat = this._r
    this._startTime = now() + (noDelay ? 0 : this._delayTime)

    if (!this._isPlaying) {
      add(this)
    }

    return this.emit(EVENT_RS, this.object)
  }

  /**
   * Seek tween value by `time`
   * @param {Time} time Tween update time
   * @param {boolean=} keepPlaying When this param is set to `false`, tween pausing after seek
   * @example tween.seek(500)
   * @memberof Tween
   */
  public seek(time: number, keepPlaying?: boolean) {
    this._startTime = now() + Math.max(0, Math.min(
      time, this._duration))

    this.emit(EVENT_SEEK, time, this.object)

    return keepPlaying ? this : this.pause()
  }

  /**
   * Sets tween duration
   * @param {number} amount Duration is milliseconds
   * @example tween.duration(2000)
   * @memberof Tween
   */
  public duration(amount: number) {
    this._duration = typeof (amount) === 'function' ? amount(this._duration) : amount

    return this
  }

  /**
   * Sets target value and duration
   * @param {object} properties Target value (to value)
   * @param {number|Object=} [duration=1000] Duration of tween
   * @example let tween = new Tween({x:0}).to({x:100}, 2000)
   * @memberof Tween
   */
  public to(properties: Object, duration: any = 1000, maybeUsed?: any) {
    this._valuesEnd = properties

    if (typeof duration === 'number' || typeof (duration) === 'function') {
      this._duration = typeof (duration) === 'function' ? duration(this._duration) : duration
    } else if (typeof duration === 'object') {
      for (const prop in duration) {
        if (typeof this[prop] === 'function') {
          const [arg1 = null, arg2 = null, arg3 = null, arg4 = null] = Array.isArray(duration[prop]) ? duration[prop] : [duration[prop]]
          this[prop](arg1, arg2, arg3, arg4)
        }
      }
    }

    return this
  }

  /**
   * Renders and computes value at first render
   * @private
   * @memberof Tween
   */
  public render() {
    if (this._rendered) {
      return this;
    }
    let { _valuesEnd, object, Renderer, node, InitialValues, _easingFunction } = this;
    if (node && InitialValues) {
      if (!object) {
        object = this.object = NodeCache(node, InitialValues(node, _valuesEnd));
      }
      else if (!_valuesEnd) {
        _valuesEnd = this._valuesEnd = InitialValues(node, object);
      }
    }
    for (const property in _valuesEnd) {
      const start = object && object[property];
      const end = _valuesEnd[property];
      if (Plugins[property]) {
        const plugin = Plugins[property].prototype.update ? new Plugins[property](this, start, end, property, object) : Plugins[property](this, start, end, property, object);
        if (plugin) {
          _valuesEnd[property] = plugin;
        }
        continue;
      }
    }

    this._valuesFunc = InterTween(object, _valuesEnd, null, _easingFunction)

    if (Renderer && this.node) {
      this.__render = new Renderer(this, object, _valuesEnd);
    }

    return this
  }

  /**
   * Start the tweening
   * @param {number} time setting manual time instead of Current browser timestamp
   * @example tween.start()
   * @memberof Tween
   */
  public start(time?: number) {
    this._startTime = time !== undefined ? time : now()
    this._startTime += this._delayTime

    this._onStartCallbackFired = false
    this._rendered = false
    this._isPlaying = true

    add(this)

    return this
  }

  /**
   * Stops the tween
   * @example tween.stop()
   * @memberof Tween
   */
  public stop() {
    const {
      _isPlaying,
      object,
      _startTime,
      _duration
    } = this

    if (!_isPlaying) {
      return this
    }

    this.update(_startTime + _duration)

    this._isPlaying = false
    remove(this)

    return this.emit(EVENT_STOP, object)
  }

  /**
   * Set delay of tween
   * @param {number} amount Sets tween delay / wait duration
   * @example tween.delay(500)
   * @memberof Tween
   */
  public delay(amount: number) {
    this._delayTime = typeof (amount) === 'function' ? amount(this._delayTime) : amount

    return this
  }

  /**
   * Sets how times tween is repeating
   * @param {amount} amount the times of repeat
   * @example tween.repeat(5)
   * @memberof Tween
   */
  public repeat(amount: number) {
    this._repeat = typeof (amount) === 'function' ? amount(this._repeat) : amount
    this._r = this._repeat
    this._isFinite = isFinite(amount)

    return this
  }

  /**
   * Set delay of each repeat of tween
   * @param {number} amount Sets tween repeat delay / repeat wait duration
   * @example tween.repeatDelay(400)
   * @memberof Tween
   */
  public repeatDelay(amount: number) {
    this._repeatDelayTime = typeof (amount) === 'function' ? amount(this._repeatDelayTime) : amount

    return this
  }

  /**
   * Set delay of each repeat alternate of tween
   * @param {number} amount Sets tween repeat alternate delay / repeat alternate wait duration
   * @example tween.reverseDelay(500)
   * @memberof Tween
   */
  public reverseDelay(amount: number) {
    this._reverseDelayTime = typeof (amount) === 'function' ? amount(this._reverseDelayTime) : amount

    return this
  }

  /**
   * Set `yoyo` state (enables reverse in repeat)
   * @param {boolean} state Enables alternate direction for repeat
   * @param {Function=} _easingReverse Easing function in reverse direction
   * @example tween.yoyo(true)
   * @memberof Tween
   */
  public yoyo(state: boolean, _easingReverse?: Function) {
    this._yoyo = typeof (state) === 'function' ? state(this._yoyo) : state === null ? this._yoyo : state
    this._easingReverse = _easingReverse || this._easingFunction

    return this
  }

  /**
   * Set easing
   * @param {Function} _easingFunction Easing function, applies in non-reverse direction if Tween#yoyo second argument is applied
   * @example tween.easing(Easing.Elastic.InOut)
   * @memberof Tween
   */
  public easing(_easingFunction: Function) {
    this._easingFunction = _easingFunction

    return this
  }

  /**
   * Reassigns value for rare-case like Tween#restart or for Timeline
   * @private
   * @memberof Tween
   */
  public reassignValues(time) {
    const {
      _valuesFunc,
      object,
      _delayTime
    } = this

    this._isPlaying = true
    this._startTime = time !== undefined ? time : now()
    this._startTime += _delayTime
    add(this)

    const _valuesStart: any = _valuesFunc(0)

    for (const property in _valuesStart) {

      const start = _valuesStart[property]

      object[property] = start
    }

    return this
  }

  /**
   * Updates initial object to target value by given `time`
   * @param {Time} time Current time
   * @param {boolean=} preserve Prevents from removing tween from store
   * @example tween.update(100)
   * @memberof Tween
   */
  public update(time: number, preserve?: boolean) {
    let {
      _onStartCallbackFired,
      _easingFunction,
      _easingReverse,
      _repeat,
      _repeatDelayTime,
      _reverseDelayTime,
      _yoyo,
      _reversed,
      _startTime,
      _duration,
      _valuesFunc,
      object,
      _isFinite,
      _isPlaying,
      __render
    } = this

    let elapsed: number
    let currentEasing: Function

    time = time !== undefined ? time : now()

    if (!_isPlaying || time < _startTime) {
      return true
    }

    if (!_onStartCallbackFired) {
      if (!this._rendered) {
        this.render()
        this._rendered = true
        _valuesFunc = this._valuesFunc
      }

      this.emit(EVENT_START, object)

      this._onStartCallbackFired = true
    }

    elapsed = (time - _startTime) / _duration
    elapsed = elapsed > 1 ? 1 : elapsed
    elapsed = _reversed ? 1 - elapsed : elapsed

    currentEasing = _reversed ? _easingReverse : _easingFunction

    if (!object) {
      return true
    }

    _valuesFunc(elapsed, elapsed, currentEasing)

    if (__render) {
      __render.update(object, elapsed)
    }

    this.emit(EVENT_UPDATE, object, elapsed)

    if (elapsed === 1 || (_reversed && elapsed === 0)) {
      if (_repeat) {
        if (_isFinite) {
          this._repeat--
        }

        if (_yoyo) {
          this._reversed = !_reversed
        }

        this.emit(_yoyo && !_reversed ? EVENT_REVERSE : EVENT_REPEAT, object)

        if (!_reversed && _repeatDelayTime) {
          this._startTime = time + _repeatDelayTime
        } else if (_reversed && _reverseDelayTime) {
          this._startTime = time + _reverseDelayTime
        } else {
          this._startTime = time
        }

        return true
      } else {
        if (!preserve) {
          this._isPlaying = false
          remove(this)
          _id--
        }
        this.emit(EVENT_COMPLETE, object)
        this._repeat = this._r

        return false
      }
    }

    return true
  }
}

export default Tween
