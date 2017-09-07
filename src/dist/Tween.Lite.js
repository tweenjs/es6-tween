import {
  add,
  remove,
  now
}
  from './core'
import Easing from './Easing'
import Interpolation from './Interpolation'

let _id = 0 // Unique ID

class Tween {
  constructor (object) {
    this.id = _id++
    this.object = object
    this._valuesStart = {}
    this._valuesEnd = null
    this._valuesStartRepeat = {}

    this._duration = 1000
    this._easingFunction = Easing.Linear.None
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
    this._isFinite = true

    /* Callbacks */
    this._onStartCallback = null
    this._onUpdateCallback = null
    this._onCompleteCallback = null

    return this
  }

  onStart (callback) {
    this._onStartCallback = callback

    return this
  }

  onUpdate (callback) {
    this._onUpdateCallback = callback

    return this
  }

  onComplete (callback) {
    this._onCompleteCallback = callback

    return this
  }

  isPlaying () {
    return this._isPlaying
  }

  isStarted () {
    return this._onStartCallbackFired
  }

  pause () {
    if (!this._isPlaying) {
      return this
    }

    this._isPlaying = false

    remove(this)
    this._pausedTime = now()

    return this
  }

  play () {
    if (this._isPlaying) {
      return this
    }

    this._isPlaying = true

    this._startTime += now() - this._pausedTime
    add(this)
    this._pausedTime = now()

    return this
  }

  duration (amount) {
    this._duration = typeof (amount) === 'function' ? amount(this._duration) : amount

    return this
  }

  to (properties, duration = 1000) {
    this._valuesEnd = properties

    this._duration = duration

    return this
  }

  start (time) {
    this._startTime = time !== undefined ? time : now()
    this._startTime += this._delayTime

    let {
      _valuesEnd,
      _valuesStartRepeat,
      _valuesStart,
      _interpolationFunction,
      object
    } = this

    for (let property in _valuesEnd) {
      let start = object[property]
      let end = _valuesEnd[property]

      if (!object || object[property] === undefined) {
        continue
      }

      let obj = object[property]

      if (typeof start === 'number') {
        if (typeof end === 'string') {
          _valuesStartRepeat[property] = end
          end = start + parseFloat(end)
        } else if (Array.isArray(end)) {
          end.unshift(start)
          let _endArr = end
          end = t => {
            return _interpolationFunction(_endArr, t)
          }
        }
      } else if (typeof end === 'object') {
        if (Array.isArray(end)) {
          let _endArr = end
          let _start = start.map(item => item)
          let i
          const len = end.length
          end = t => {
            i = 0
            for (; i < len; i++) {
              obj[i] = typeof _start[i] === 'number' ? _start[i] + (_endArr[i] - _start[i]) * t : _endArr[i]
            }
            return obj
          }
        } else {
          let _endObj = end
          let _start = {}
          for (let p in start) {
            _start[p] = start[p]
          }
          end = t => {
            for (let i in end) {
              obj[i] = typeof _start[i] === 'number' ? _start[i] + (_endObj[i] - _start[i]) * t : _endObj[i]
            }
            return obj
          }
        }
      }

      _valuesStart[property] = start
      _valuesEnd[property] = end
    }

    add(this)

    this._isPlaying = true

    return this
  }

  stop () {
    let {
      _isPlaying,
      _startTime,
      _duration
    } = this

    if (!_isPlaying) {
      return this
    }

    this.update(_startTime + _duration)

    remove(this)
    this._isPlaying = false

    return this
  }

  delay (amount) {
    this._delayTime = typeof (amount) === 'function' ? amount(this._delayTime) : amount

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
    if (typeof fn === 'function') {
      this._easingFunction = fn
    }

    return this
  }

  interpolation (fn) {
    if (typeof fn === 'function') {
      this._interpolationFunction = fn
    }

    return this
  }

  reassignValues () {
    const {
      _valuesStart,
      _valuesEnd,
      object
    } = this

    for (let property in _valuesEnd) {
      let start = _valuesStart[property]

      object[property] = start
    }

    return this
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
      _valuesStart,
      _valuesEnd,
      _valuesStartRepeat,
      object,
      _isFinite,
      _isPlaying,
      _onStartCallback,
      _onUpdateCallback,
      _onCompleteCallback
    } = this

    let elapsed
    let value
    let property

    time = time !== undefined ? time : now()

    if (!_isPlaying || time < _startTime) {
      return true
    }

    if (!_onStartCallbackFired) {
      if (_onStartCallback) {
        _onStartCallback(object)
      }

      this._onStartCallbackFired = true
    }

    elapsed = (time - _startTime) / _duration
    elapsed = elapsed > 1 ? 1 : elapsed
    elapsed = _reversed ? 1 - elapsed : elapsed

    value = _easingFunction(elapsed)

    for (property in _valuesEnd) {
      let start = _valuesStart[property]
      let end = _valuesEnd[property]

      if (start === undefined) {
        continue
      } else if (typeof end === 'function') {
        object[property] = end(value)
      } else if (typeof end === 'number') {
        object[property] = start + (end - start) * value
      }
    }

    if (_onUpdateCallback) {
      _onUpdateCallback(object, elapsed)
    }

    if (elapsed === 1 || (_reversed && elapsed === 0)) {
      if (_repeat) {
        if (_isFinite) {
          this._repeat--
        }

        if (!_reversed) {
          for (property in _valuesStartRepeat) {
            _valuesStart[property] = _valuesEnd[property]
            _valuesEnd[property] += parseFloat(_valuesStartRepeat[property])
          }
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
        this._isPlaying = false
        if (_onCompleteCallback) {
          _onCompleteCallback()
        }
        this._repeat = this._r
        _id--

        return false
      }
    }

    return true
  }
}

export default Tween
