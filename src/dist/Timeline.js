import Tween, { EVENT_UPDATE, EVENT_RS, EVENT_REPEAT, EVENT_REVERSE, EVENT_COMPLETE } from './Tween'
import { add, now } from './core'
import PlaybackPosition from './PlaybackPosition'

let _id = 0
class Timeline extends Tween {
  constructor (params) {
    super()
    this._totalDuration = 0
    this._startTime = now()
    this._tweens = {}
    this._elapsed = 0
    this._id = _id++
    this._defaultParams = params
    this.position = new PlaybackPosition()
    this.position.addLabel('afterLast', this._totalDuration)
    this.position.addLabel('afterInit', this._startTime)

    return this
  }

  addLabel (name, offset) {
    this.position.addLabel(name, offset)
    return this
  }

  map (fn) {
    for (let tween in this._tweens) {
      let _tween = this._tweens[tween]
      fn(_tween, +tween)
      this._totalDuration = Math.max(this._totalDuration, _tween._duration + _tween._startTime)
    }
    return this
  }

  add (tween, position) {
    if (Array.isArray(tween)) {
      tween.map(_tween => {
        this.add(_tween, position)
      })
      return this
    } else if (typeof tween === 'object' && !(tween instanceof Tween)) {
      tween = new Tween(tween.from).to(tween.to, tween)
    }

    let {
      _defaultParams,
      _totalDuration
    } = this

    if (_defaultParams) {
      for (let method in _defaultParams) {
        tween[method](_defaultParams[method])
      }
    }

    const offset = typeof position === 'number' ? position : this.position.parseLabel(typeof position !== 'undefined' ? position : 'afterLast', null)
    tween._startTime = this._startTime
    tween._startTime += offset
    this._totalDuration = Math.max(_totalDuration, tween._startTime + tween._delayTime + tween._duration)
    this._tweens[tween.id] = tween
    this.position.setLabel('afterLast', this._totalDuration)
    return this
  }

  restart () {
    this._startTime += now()

    add(this)

    return this.emit(EVENT_RS)
  }

  easing (easing) {
    return this.map(tween => tween.easing(easing))
  }

  interpolation (interpolation) {
    return this.map(tween => tween.interpolation(interpolation))
  }

  reverse () {
    this._reversed = !this._reversed
    return this.emit(EVENT_REVERSE)
  }

  update (time) {
    let {
      _tweens,
      _totalDuration,
      _repeatDelayTime,
      _reverseDelayTime,
      _startTime,
      _reversed,
      _yoyo,
      _repeat,
      _isFinite
    } = this

    if (time < _startTime) {
      return true
    }

    let elapsed = Math.min(1, Math.max(0, (time - _startTime) / _totalDuration))
    elapsed = _reversed ? 1 - elapsed : elapsed
    this._elapsed = elapsed

    let timing = time - _startTime
    let _timing = _reversed ? _totalDuration - timing : timing

    for (let tween in _tweens) {
      let _tween = _tweens[tween]
      if (_tween.skip) {
        _tween.skip = false
      } else if (_tween.update(_timing)) {
        continue
      } else {
        _tween.skip = true
      }
    }

    this.emit(EVENT_UPDATE, elapsed, timing)

    if (elapsed === 1 || (_reversed && elapsed === 0)) {
      if (_repeat) {
        if (_isFinite) {
          this._repeat--
        }

        this.emit(_reversed ? EVENT_REVERSE : EVENT_REPEAT)

        if (_yoyo) {
          this.reverse()
        }

        if (!_reversed && _repeatDelayTime) {
          this._startTime += _totalDuration + _repeatDelayTime
        } else if (_reversed && _reverseDelayTime) {
          this._startTime += _totalDuration + _reverseDelayTime
        } else {
          this._startTime += _totalDuration
        }

        for (let tween in _tweens) {
          let _tween = _tweens[tween]
          if (_tween.skip) {
            _tween.skip = false
          }
          _tween.reassignValues()
        }

        return true
      } else {
        this.emit(EVENT_COMPLETE)
        this._repeat = this._r

        for (let tween in _tweens) {
          let _tween = _tweens[tween]
          if (_tween.skip) {
            _tween.skip = false
          }
        }

        return false
      }
    }

    return true
  }

  elapsed (value) {
    return value !== undefined ? this.update(value * this._totalDuration) : this._elapsed
  }

  seek (value) {
    return this.update(value < 1.1 ? value * this._totalDuration : value)
  }
}
export default Timeline
