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

class Tween extends EventClass {
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
    this._valuesEnd = null

    this._duration = 1000
    this._easingFunction = Easing.Linear.None

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

    return this
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

  to (properties, duration = 1000) {
    this._valuesEnd = properties

    if (typeof duration === 'number' || typeof (duration) === 'function') {
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
      object,
      Renderer
    } = this

    if (typeof _valuesEnd === 'object') {
      for (let property in _valuesEnd) {
        if (Plugins[property]) {
          _valuesEnd[property] = new Plugins[property](this, object[property], _valuesEnd[property])
        }
      }
    }

    if (Renderer && this.node) {
      this.__render = new Renderer(this, object, _valuesEnd)
    }

    return this
  }

  start (time) {
    this._startTime = time !== undefined ? time : now()
    this._startTime += this._delayTime

    add(this)

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
    this._isFinite = isFinite(amount)

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

  reassignValues () {
    const {
      _valuesEnd,
      object
    } = this

    let v0 = _valuesEnd(0)

    if (typeof v0 === 'object') {
      let isArr = Array.isArray(v0)
      for (let property in v0) {
        if (isArr) property *= 1
        object[property] = v0[property]
      }
    }

    return this
  }

  get (time) {
    this.update(time)
    return this.object
  }

  update (time, preserve) {
    let {
      _onStartCallbackFired,
      _easingFunction,
      _repeat,
      _repeatDelayTime,
      _reverseDelayTime,
      _yoyo,
      _reversed,
      _startTime,
      _duration,
      _valuesEnd,
      object,
      _isFinite,
      __render
    } = this

    let elapsed
    let value

    time = time !== undefined ? time : now()

    if (time < _startTime) {
      return true
    }

    if (!_onStartCallbackFired) {
      if (!this._rendered) {
        this.render()
        this._rendered = true
        if (typeof _valuesEnd !== 'function') {
          this._valuesEnd = _valuesEnd = InterTween(object, _valuesEnd)
        }
      }

      this.emit(EVENT_START, object)

      this._onStartCallbackFired = true
    }

    elapsed = (time - _startTime) / _duration
    elapsed = elapsed > 1 ? 1 : elapsed
    elapsed = _reversed ? 1 - elapsed : elapsed

    value = _easingFunction(elapsed)

    object = _valuesEnd(value)

    if (__render) {
      __render.update(object, elapsed)
    }

    this.emit(EVENT_UPDATE, object, value, elapsed)

    if (elapsed === 1 || (_reversed && elapsed === 0)) {
      if (_repeat) {
        if (_isFinite) {
          this._repeat--
        }

        if (_yoyo) {
          this._reversed = !_reversed
        }

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
          remove(this)
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
