import Tween, { EVENT_UPDATE, EVENT_RS, EVENT_REPEAT, EVENT_REVERSE, EVENT_COMPLETE } from './Tween'
import { add, now, remove } from './core'
import PlaybackPosition from './PlaybackPosition'

export const shuffle = a => {
  let j
  let x
  let i
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i)
    x = a[i - 1]
    a[i - 1] = a[j]
    a[j] = x
  }
  return a
}

let _id = 0
class Timeline extends Tween {
  constructor (params) {
    super()
    this._totalDuration = 0
    this._startTime = now()
    this._tweens = []
    this._elapsed = 0
    this._id = _id++
    this._defaultParams = params
    this.position = new PlaybackPosition()
    this.position.addLabel('afterLast', this._totalDuration)
    this.position.addLabel('afterInit', this._startTime)

    return this
  }
  mapTotal (fn) {
    fn.call(this, this._tweens)
    return this
  }
  timingOrder (fn) {
    const timing = fn(this._tweens.map(t => t._startTime))
    this._tweens.map((tween, i) => { tween._startTime = timing[i] })
    return this
  }
  getTiming (mode, nodes, params, offset = 0) {
    if (mode === 'reverse') {
      const { stagger } = params
      const totalStagger = (stagger || 0) * (nodes.length - 1)
      return nodes.map((node, i) => totalStagger - ((stagger || 0) * i) + offset)
    } else if (mode === 'async') {
      return nodes.map(node => offset)
    } else if (mode === 'sequence' || mode === 'delayed') {
      let { stagger } = params
      if (!stagger) {
        stagger = (params.duration || 1000) / (nodes.length - 1)
      }
      return nodes.map((node, i) => (stagger * i) + offset)
    } else if (mode === 'oneByOne') {
      return nodes.map(node => params.duration)
    } else if (mode === 'shuffle') {
      const { stagger } = params
      return shuffle(nodes.map((node, i) => ((stagger || 0) * i) + offset))
    } else {
      const { stagger } = params
      return nodes.map((node, i) => ((stagger || 0) * i) + offset)
    }
  }
  fromTo (nodes, from, to, params) {
    if (Array.isArray(nodes)) {
      if (this._defaultParams) {
        params = { ...this._defaultParams, ...params }
      }
      const position = params.label
      const offset = typeof position === 'number' ? position : this.position.parseLabel(typeof position !== 'undefined' ? position : 'afterLast', null)
      const mode = this.getTiming(params.mode, nodes, params, offset)
      nodes.map((node, i) => {
        this.add(Tween.fromTo(node, typeof from === 'function' ? from(i, nodes.length) : { ...from }, typeof to === 'function' ? to(i, nodes.length) : to, typeof params === 'function' ? params(i, nodes.length) : params), mode[i])
      })
    }
    return this.start()
  }

  from (nodes, from, params) {
    return this.fromTo(nodes, from, null, params)
  }

  to (nodes, to, params) {
    return this.fromTo(nodes, null, to, params)
  }

  addLabel (name, offset) {
    this.position.addLabel(name, offset)
    return this
  }

  map (fn) {
    for (let i = 0, len = this._tweens.length; i < len; i++) {
      let _tween = this._tweens[i]
      fn(_tween, i)
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
        if (typeof tween[method] === 'function') {
          tween[method](_defaultParams[method])
        }
      }
    }

    const offset = typeof position === 'number' ? position : this.position.parseLabel(typeof position !== 'undefined' ? position : 'afterLast', null)
    tween._startTime = Math.max(this._startTime, tween._delayTime)
    tween._startTime += offset
    tween._isPlaying = true
    this._totalDuration = Math.max(_totalDuration, tween._startTime + tween._delayTime + tween._duration)
    this._tweens.push(tween)
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
      _isFinite,
      _elapsed,
      _isPlaying
    } = this

    if (!_isPlaying || time < _startTime) {
      return true
    }

    let elapsed = (time - _startTime) / _totalDuration
    elapsed = elapsed > 1 ? 1 : elapsed
    elapsed = _reversed ? 1 - elapsed : elapsed
    elapsed = ((elapsed * 1000) | 0) / 1000

    if (elapsed === _elapsed) {
      return true
    }
    this._elapsed = elapsed

    let timing = time - _startTime
    let _timing = _reversed ? _totalDuration - timing : timing

    let i = 0
    while (i < _tweens.length) {
      _tweens[i].update(_timing, true)
      i++
    }

    this.emit(EVENT_UPDATE, elapsed, timing)

    if (elapsed === 1 || (_reversed && elapsed === 0)) {
      if (_repeat) {
        if (_isFinite) {
          this._repeat--
        }

        this.emit(_reversed ? EVENT_REVERSE : EVENT_REPEAT)

        if (_yoyo) {
          this._reversed = !_reversed
          this.timingOrder(timing => timing.reverse())
        }

        if (!_reversed && _repeatDelayTime) {
          this._startTime = time + _repeatDelayTime
        } else if (_reversed && _reverseDelayTime) {
          this._startTime = time + _reverseDelayTime
        } else {
          this._startTime = time
        }

        while (i < _tweens.length) {
          _tweens[i].reassignValues()
          i++
        }

        return true
      } else {
        this.emit(EVENT_COMPLETE)
        this._repeat = this._r

        remove(this)
        this._isPlaying = false

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
