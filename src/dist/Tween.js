import {
  add,
  remove,
  now,
  Plugins
}
  from './core'
import Easing from './Easing'
import InterTween from 'intertween'
import NodeCache from './NodeCache'
import EventClass from './Event'
import { create } from '../shim'

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

/**
 * Tween main constructor
 * @namespace Tween
 * @param {Object|Element} node Node Element or Tween initial object
 * @param {Object=} object If Node Element is using, second argument is used for Tween initial object
 * @example let tween = new Tween(myNode, {width:'100px'}).to({width:'300px'}, 2000).start()
 */
class Tween extends EventClass {
  /**
   * Easier way to call the Tween
   * @param {Element} node DOM Element
   * @param {Object} object - Initial value
   * @param {Object} to - Target value
   * @param {Object} params - Options of tweens
   * @memberof Tween
   * @static
   */
  static fromTo (node, object, to, params = {}) {
    params.quickRender = params.quickRender ? params.quickRender : !to
    let tween = new Tween(node, object).to(to, params)
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
   * @param {Object} to - Target value
   * @param {Object} params - Options of tweens
   * @memberof Tween
   * @static
   */
  static to (node, to, params) {
    return Tween.fromTo(node, null, to, params)
  }
  /**
   * Easier way calling constructor only applies the `from` value, useful for CSS Animation
   * @param {Element} node DOM Element
   * @param {Object} from - Initial value
   * @param {Object} params - Options of tweens
   * @memberof Tween
   * @static
   */
  static from (node, from, params) {
    return Tween.fromTo(node, from, null, params)
  }
  constructor (node, object) {
    super()

    this.id = _id++
    if (typeof node !== 'undefined' && !object && !node.nodeType) {
      object = this.object = node
      node = null
    } else if (typeof node !== 'undefined') {
      this.node = node
      if (typeof object === 'object') {
        object = this.object = NodeCache(node, object)
      } else {
        this.object = object
      }
    }
    let isArr = this.isArr = Array.isArray(object)
    this._valuesStart = isArr ? [] : {}
    this._valuesEnd = null
    this._valuesFunc = {}

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
   * @returns {Boolean} Returns the tween is playing
   * @example tween.isPlaying() // returns `true` if tween in progress
   */
  isPlaying () {
    return this._isPlaying
  }

  /**
   * @returns {Boolean} Returns the tween is started
   * @example tween.isStarted() // returns `true` if tween in started
   */
  isStarted () {
    return this._onStartCallbackFired
  }

  /**
   * Reverses the tween state/direction
   * @example tween.reverse()
   */
  reverse () {
    const {
      _reversed
    } = this

    this._reversed = !_reversed

    return this
  }

  /**
   * @returns {Boolean} Returns the tween is reversed
   * @example tween.reversed() // returns `true` if tween in reversed state
   */
  reversed () {
    return this._reversed
  }

  /**
   * Pauses tween
   * @example tween.pause()
   */
  pause () {
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
   */
  play () {
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
   * @param {Boolean=} noDelay If this param is set to `true`, restarts tween without `delay`
   */
  restart (noDelay) {
    this._repeat = this._r
    this._startTime = now() + (noDelay ? 0 : this._delayTime)

    if (!this._isPlaying) {
      add(this)
    }

    return this.emit(EVENT_RS, this._object)
  }

  /**
   * Seek tween value by `time`
   * @param {Time} time Tween update time
   * @param {Boolean=} keepPlaying When this param is set to `false`, tween pausing after seek
   */
  seek (time, keepPlaying) {
    this._startTime = now() + Math.max(0, Math.min(
      time, this._duration))

    this.emit(EVENT_SEEK, time, this._object)

    return keepPlaying ? this : this.pause()
  }

  /**
   * Sets tween duration
   * @param {Number} amount Duration is milliseconds
   */
  duration (amount) {
    this._duration = typeof (amount) === 'function' ? amount(this._duration) : amount

    return this
  }

  /**
   * Sets target value and duration
   * @param {Object} properties Target value (to value)
   * @param {Number|Object=} [duration=1000] Duration of tween
   */
  to (properties, duration = 1000) {
    this._valuesEnd = properties

    if (typeof duration === 'number' || typeof (duration) === 'function') {
      this._duration = typeof (duration) === 'function' ? duration(this._duration) : duration
    } else if (typeof duration === 'object') {
      for (let prop in duration) {
        if (typeof this[prop] === 'function') {
          let [arg1, arg2, arg3, arg4] = Array.isArray(duration[prop]) ? duration[prop] : [duration[prop]]
          this[prop](arg1, arg2, arg3, arg4)
        }
      }
    }

    return this
  }


  /**
   * Renders and computes value at first render
   * @private
   */
  render () {
    if (this._rendered) {
      return this
    }

    let {
      _valuesEnd,
      _valuesFunc,
      _valuesStart,
      object,
      Renderer,
      node,
      InitialValues
    } = this

    if (node && InitialValues) {
      if (!object) {
        object = this.object = NodeCache(node, InitialValues(node, _valuesEnd))
      } else if (!_valuesEnd) {
        _valuesEnd = this._valuesEnd = InitialValues(node, object)
      }
    }

    for (let property in _valuesEnd) {
      let start = object && object[property]
      let end = _valuesEnd[property]

      if (Plugins[property]) {
        let plugin = Plugins[property].prototype.update ? new Plugins[property](this, start, end, property, object) : Plugins[property](this, start, end, property, object)
        if (plugin) {
          _valuesFunc[property] = plugin
        }
        continue
      }

      if (!object || object[property] === undefined) {
        continue
      }

      if (typeof end === 'number' && typeof start === 'number') {
        _valuesStart[property] = start
        _valuesEnd[property] = end
      } else {
        _valuesFunc[property] = InterTween(start, end)
      }
    }

    if (Renderer && this.node) {
      this.__render = new Renderer(this, object, _valuesEnd)
    }

    return this
  }

  /**
   * Start the tweening
   * @param {Number} time setting manual time instead of Current browser timestamp
   */
  start (time) {
    this._startTime = time !== undefined ? time : now()
    this._startTime += this._delayTime

    add(this)

    this._isPlaying = true

    return this
  }

  /**
   * Stops the tween 
   */
  stop () {
    let {
      _isPlaying,
      object,
      _startTime,
      _duration
    } = this

    if (!_isPlaying) {
      return this
    }

    this.update(_startTime + _duration)

    remove(this)
    this._isPlaying = false

    return this.emit(EVENT_STOP, object)
  }

  /**
   * Set delay of tween
   * @param {Number} amount Sets tween delay / wait duration
   */
  delay (amount) {
    this._delayTime = typeof (amount) === 'function' ? amount(this._delayTime) : amount
    this._startTime += this._delayTime

    return this
  }

  /**
   * Sets how times tween is repeating
   * @param {amount} the times of repeat
   */
  repeat (amount) {
    this._repeat = typeof (amount) === 'function' ? amount(this._repeat) : amount
    this._r = this._repeat
    this._isFinite = isFinite(amount)

    return this
  }

  /**
   * Set delay of each repeat of tween
   * @param {Number} amount Sets tween repeat delay / repeat wait duration
   */
  repeatDelay (amount) {
    this._repeatDelayTime = typeof (amount) === 'function' ? amount(this._repeatDelayTime) : amount

    return this
  }

  /**
   * Set delay of each repeat alternate of tween
   * @param {Number} amount Sets tween repeat alternate delay / repeat alternate wait duration
   */
  reverseDelay (amount) {
    this._reverseDelayTime = typeof (amount) === 'function' ? amount(this._reverseDelayTime) : amount

    return this
  }

  /**
   * Set `yoyo` state (enables reverse in repeat)
   * @param {Boolean} state Enables alternate direction for repeat
   * @param {Function=} _easingReverse Easing function in reverse direction
   */
  yoyo (state, _easingReverse) {
    this._yoyo = typeof (state) === 'function' ? state(this._yoyo) : state === null ? this._yoyo : state
    this._easingReverse = _easingReverse || defaultEasing

    return this
  }

  /**
   * Set easing
   * @param {Function=} _easingFunction Easing function in non-reverse direction
   */
  easing (_easingFunction) {
    this._easingFunction = _easingFunction

    return this
  }

  reassignValues () {
    const {
      _valuesStart,
      _valuesEnd,
      object,
      isArr
    } = this

    for (let property in _valuesEnd) {
      if (isArr) {
        property *= 1
      }

      let start = _valuesStart[property]
      let end = _valuesEnd[property]

      object[property] = typeof end === 'function' ? end(0) : start
    }

    return this
  }

  /**
   * Updates initial object to target value by given `time`
   * @param {Time} time Current time
   * @param {Boolean=} preserve Prevents from removing tween from store
   */
  update (time, preserve) {
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
      _valuesStart,
      _valuesEnd,
      _valuesFunc,
      object,
      _isFinite,
      _isPlaying,
      __render
    } = this

    let elapsed
    let value
    let property
    let currentEasing

    time = time !== undefined ? time : now()

    if (!_isPlaying || time < _startTime) {
      return true
    }

    if (!_onStartCallbackFired) {
      if (!this._rendered) {
        this.render()
        this._rendered = true
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

    for (property in _valuesEnd) {
      value = currentEasing[property] ? currentEasing[property](elapsed) : typeof currentEasing === 'function' ? currentEasing(elapsed) : defaultEasing(elapsed)

      let start = _valuesStart[property]
      let end = _valuesEnd[property]
      let fnc = _valuesFunc[property]

      if (fnc && fnc.update) {
        fnc.update(value, elapsed)
      } else if (fnc) {
        object[property] = fnc(value)
      } else if (typeof end === 'number') {
        object[property] = start + (end - start) * value
      } else {
        object[property] = end
      }
    }

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
