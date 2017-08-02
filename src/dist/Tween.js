import {
  add,
  remove,
  now,
  nextId
}
  from './core'
import Easing from './Easing'
import Interpolation from './Interpolation'
import SubTween from './SubTween'
import Store from './Store'
import EventClass from './Event'

const defaultEasing = Easing.Linear.None

// Events list
const EVENT_UPDATE = 'update'
const EVENT_COMPLETE = 'complete'
const EVENT_START = 'start'
const EVENT_REPEAT = 'repeat'
const EVENT_REVERSE = 'reverse'
const EVENT_PAUSE = 'pause'
const EVENT_PLAY = 'play'
const EVENT_RS = 'restart'
const EVENT_STOP = 'stop'
const EVENT_SEEK = 'seek'

class Tween extends EventClass {
  constructor (object = {}, instate) {
    super()

    this.isJoinToString = typeof object === 'string'
    this.object = object
    this._valuesStart = Tween.createEmptyConst(object)
    this._valuesEnd = Tween.createEmptyConst(object)

    this._duration = 1000
    this._easingFunction = defaultEasing
    this._interpolationFunction = Interpolation.Linear

    this._startTime = 0
    this._delayTime = 0
    this._repeat = 0
    this._r = 0
    this._isPlaying = false
    this._yoyo = false
    this._reversed = false

    this._onStartCallbackFired = false
    this._pausedTime = null
    this.id = nextId()

    if (instate && instate.to) {
      return new Tween(object)
        .to(instate.to, instate)
    }

    return this
  }

  static createEmptyConst (oldObject) {
    return typeof (oldObject) === 'number' ? 0 : Array.isArray(oldObject) ? [] : typeof (oldObject) === 'object' ? {}
      : ''
  }

  static checkValidness (valid) {
    return valid !== undefined && valid !== null && valid !== '' && ((typeof valid === 'number' && !isNaN(valid)) || typeof valid !== 'number') && valid !== Infinity
  }

  isPlaying () {
    return this._isPlaying
  }

  isStarted () {
    return this._onStartCallbackFired
  }

  reverse () {
    const {
      _reversed
    } = this

    this._reversed = !_reversed

    return this
  }

  reversed () {
    return this._reversed
  }

  useActiveMode () {
    this.object = Store.add(this.object)
    return this
  }

  pause () {
    if (!this._isPlaying) {
      return this
    }

    this._isPlaying = false

    remove(this)
    this._pausedTime = now()

    return this.emit(EVENT_PAUSE, this.object)
  }

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

  restart (noDelay) {
    this._repeat = this._r
    this._startTime = now() + (noDelay ? 0 : this._delayTime)

    if (!this._isPlaying) {
      add(this)
    }

    return this.emit(EVENT_RS, this._object)
  }

  seek (time, keepPlaying) {
    this._startTime = now() + Math.max(0, Math.min(
      time, this._duration))

    this.emit(EVENT_SEEK, time, this._object)

    return keepPlaying ? this : this.pause()
  }

  duration (amount) {
    this._duration = typeof (amount) === 'function' ? amount(this._duration) : amount

    return this
  }

  to (properties = {}, duration = 1000) {
    if (typeof properties === 'object') {
      this._valuesEnd = properties
    }

    if (typeof duration === 'number') {
      this._duration = typeof (duration) === 'function' ? duration(this._duration) : duration
    } else if (typeof duration === 'object') {
      for (let prop in duration) {
        if (this[prop]) {
          this[prop](...(Array.isArray(duration) ? duration : [duration]))
        }
      }
    }

    return this
  }

  render () {
    if (this._rendered) {
      return this
    }

    let {
      _valuesEnd,
      object
    } = this

    for (let property in _valuesEnd) {
      if (typeof _valuesEnd[property] === 'object' && _valuesEnd[property]) {
        this._valuesEnd[property] = SubTween(object[property], _valuesEnd[property])
        if (typeof this._valuesEnd[property] === 'function') {
          this.object[property] = this._valuesEnd[property](0)
        }
      } else if (typeof _valuesEnd[property] === 'string' && typeof object[property] === 'string') {
        this._valuesEnd[property] = SubTween(object[property], _valuesEnd[property])
        if (typeof this._valuesEnd[property] === 'function') {
          this.object[property] = this._valuesEnd[property](0)
        }
      }

      // If `to()` specifies a property that doesn't exist in the source object,
      // we should not set that property in the object
      if (Tween.checkValidness(object[property]) === false) {
        continue
      }

      // If duplicate or non-tweening numerics matched,
      // we should skip from adding to _valuesStart
      if (object[property] === _valuesEnd[property]) {
        continue
      }

      this._valuesStart[property] = object[property]
    }

    return this
  }

  start (time) {
    this._startTime = time !== undefined ? time : now()
    this._startTime += this._delayTime

    this.render()
    this._rendered = true

    add(this)

    this.emit(EVENT_START, this.object)

    this._isPlaying = true

    return this
  }

  stop () {
    let {
      _isPlaying,
      object
    } = this

    if (!_isPlaying) {
      return this
    }

    remove(this)
    this._isPlaying = false

    return this.emit(EVENT_STOP, object)
  }

  end () {
    const {
      _startTime,
      _duration
    } = this

    return this.update(_startTime + _duration)
  }

  delay (amount) {
    this._delayTime = typeof (amount) === 'function' ? amount(this._delayTime) : amount
    this._startTime += this._delayTime

    return this
  }

  repeat (amount) {
    this._repeat = typeof (amount) === 'function' ? amount(this._repeat) : amount
    this._r = this._repeat

    return this
  }

  repeatDelay (amount) {
    this._repeatDelayTime = typeof (amount) === 'function' ? amount(this._repeatDelayTime) : amount

    return this
  }

  reverseDelay (amount) {
    this._reverseDelayTime = typeof (amount) === 'function' ? amount(this._reverseDelayTime) : amount

    return this
  }

  yoyo (state) {
    this._yoyo = typeof (state) === 'function' ? state(this._yoyo) : state

    return this
  }

  easing (fn) {
    this._easingFunction = fn

    return this
  }

  interpolation (fn) {
    this._interpolationFunction = fn

    return this
  }

  get (time) {
    this.update(time)
    return this.object
  }

  update (time) {
    let {
      _onStartCallbackFired,
      _easingFunction,
      _interpolationFunction,
      _repeat,
      _repeatDelayTime,
      _reverseDelayTime,
      _yoyo,
      _reversed,
      _startTime,
      _duration,
      _valuesStart,
      _valuesEnd,
      object
    } = this

    let property
    let elapsed
    let value

    time = time !== undefined ? time : now()

    if (time < _startTime) {
      return true
    }

    if (!_onStartCallbackFired) {
      if (!this._rendered) {
        this.render()

        this.emit(EVENT_START, object)

        this._rendered = true
      }

      this._onStartCallbackFired = true
    }

    elapsed = (time - _startTime) / _duration
    elapsed = elapsed > 1 ? 1 : elapsed
    elapsed = _reversed ? 1 - elapsed : elapsed

    value = typeof _easingFunction === 'function' ? _easingFunction(elapsed) : defaultEasing(elapsed)

    for (property in _valuesEnd) {
      // Don't update properties that do not exist in the source object
      if (_valuesStart[property] === undefined) {
        continue
      }

      let start = _valuesStart[property]
      let end = _valuesEnd[property]
      value = _easingFunction[property] ? _easingFunction[property](elapsed) : value

      if (typeof end === 'function') {
        object[property] = end(value)
      } else if (Array.isArray(end)) {
        object[property] = _interpolationFunction(end, value)
      } else if (typeof (end) === 'string') {
        if (end.charAt(0) === '+' || end.charAt(0) === '-') {
          end = start + parseFloat(end)
        } else {
          end = parseFloat(end)
        }

        // Protect against non numeric properties.
        if (typeof (end) === 'number') {
          object[property] = start + (end - start) * value
        }
      } else if (typeof (start) === 'number') {
        object[property] = start + (end - start) * value
      }
    }

    this.emit(EVENT_UPDATE, object, value, elapsed)

    this.object = object

    if (elapsed === 1 || (_reversed && elapsed === 0)) {
      if (_repeat) {
        if (isFinite(_repeat)) {
          this._repeat--
        }

        for (property in _valuesEnd) {
          if (typeof (_valuesEnd[property]) === 'string' && typeof (_valuesStart[property]) === 'number') {
            this._valuesStart[property] = _valuesStart[property] + parseFloat(_valuesEnd[property])
          }
        }

        // Reassign starting values, restart by making startTime = now
        this.emit(_reversed ? EVENT_REVERSE : EVENT_REPEAT, object)

        if (_yoyo) {
          this._reversed = !_reversed
        }

        if (!_reversed && _repeatDelayTime) {
          this._startTime += _duration + _repeatDelayTime
        } else if (_reversed && _reverseDelayTime) {
          this._startTime += _duration + _reverseDelayTime
        } else {
          this._startTime += _duration
        }

        return true
      } else {
        this.emit(EVENT_COMPLETE, object)
        this._repeat = this._r

        return false
      }
    }

    return true
  }
}

export default Tween
