/* global process */
import { root, requestAnimationFrame, cancelAnimationFrame } from '../shim'

let _tweens = []
let isStarted = false
let _autoPlay = false
let _tick
const _ticker = requestAnimationFrame
const _stopTicker = cancelAnimationFrame

const add = tween => {
  _tweens.push(tween)

  if (_autoPlay && !isStarted) {
    _tick = _ticker(update)
    isStarted = true
  }
}

const getAll = () => _tweens

const autoPlay = (state) => {
  _autoPlay = state
}

const removeAll = () => {
  _tweens.length = 0
}

const get = tween => {
  for (let i = 0; i < _tweens.length; i++) {
    if (tween === _tweens[i]) {
      return _tweens[i]
    }
  }

  return null
}

const has = tween => {
  return get(tween) !== null
}

const remove = tween => {
  let i = _tweens.indexOf(tween)
  if (i !== -1) {
    _tweens.splice(i, 1)
  }
}

let now = (function () {
  if (typeof (process) !== 'undefined' && process.hrtime !== undefined) {
    return function () {
      let time = process.hrtime()

      // Convert [seconds, nanoseconds] to milliseconds.
      return time[0] * 1000 + time[1] / 1000000
    }
  // In a browser, use window.performance.now if it is available.
  } else if (root.performance !== undefined &&
   root.performance.now !== undefined) {
    // This must be bound, because directly assigning this function
    // leads to an invocation exception in Chrome.
    return root.performance.now.bind(root.performance)
  // Use Date.now if it is available.
  } else {
    let offset = root.performance && root.performance.timing && root.performance.timing.navigationStart ? root.performance.timing.navigationStart : Date.now()
    return function () {
      return Date.now() - offset
    }
  }
}())

const update = (time, preserve) => {
  time = time !== undefined ? time : now()

  _tick = _ticker(update)

  if (_tweens.length === 0) {
    _stopTicker(_tick)
    isStarted = false
    return false
  }

  let i = 0
  while (i < _tweens.length) {
    _tweens[i].update(time, preserve)
    i++
  }

  return true
}

const isRunning = () => isStarted

const Plugins = {}

// Normalise time when visiblity is changed (if available) ...
if (root.document && root.document.addEventListener) {
  let doc = root.document
  let timeDiff = 0
  let timePause = 0
  doc.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      timePause = now()
      _stopTicker(_tick)
      isStarted = false
    } else {
      timeDiff = now() - timePause

      for (let i = 0, length = _tweens.length; i < length; i++) {
        _tweens[i]._startTime += timeDiff
      }
      _tick = _ticker(update)
      isStarted = true
    }

    return true
  })
}

export { Plugins, get, has, getAll, removeAll, remove, add, now, update, autoPlay, isRunning }
