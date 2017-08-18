/* global global, window, Object, document, process, requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout */

let _tweens = {}
let isStarted = false
let _autoPlay = false
let _tick
let root = typeof (window) !== 'undefined' ? window : typeof (global) !== 'undefined' ? global : {}
let _nextId = 0

let _ticker = fn => typeof (requestAnimationFrame) !== 'undefined' ? requestAnimationFrame(fn) : setTimeout(fn, 16.6)
let _stopTicker = fn => typeof (cancelAnimationFrame) !== 'undefined' ? cancelAnimationFrame(fn) : clearTimeout(fn)

let setProp = (o, p, param) => Object.defineProperty(o, p, param)
setProp(_tweens, 'length', {enumerable: false, writable: true, value: 0})

const add = tween => {
  let {id} = tween
  _tweens[id] = tween
  _tweens.length++

  if (_autoPlay && !isStarted) {
    _tick = _ticker(update)
    isStarted = true
  }
}

const nextId = () => {
  let id = _nextId
  _nextId++
  return id
}

const getAll = () => {
  return _tweens
}

const autoPlay = (state) => {
  _autoPlay = state
}

const removeAll = () => {
  for (let id in _tweens) {
    _tweens[id] = null
    delete _tweens[id]
  }
  _tweens.length = 0
  _stopTicker(_tick)
}

const get = tween => {
  for (let searchTween in _tweens) {
    if (tween.id === +searchTween) {
      return _tweens[searchTween]
    }
  }

  return null
}

const has = tween => {
  return get(tween) !== null
}

const remove = tween => {
  for (let searchTween in _tweens) {
    if (tween.id === +searchTween) {
      delete _tweens[searchTween]
      _tweens.length--
    }
  }
  if (_tweens.length === 0) {
    _stopTicker(_tick)
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

  let i
  let length = _tweens.length
  if (!length) {
    isStarted = false
    _stopTicker(_tick)
    return false
  }

  for (i in _tweens) {
    _tweens[i].update(time, preserve)
  }

  return true
}

const isRunning = () => isStarted

const Plugins = {}

// Normalise time when visiblity is changed (if available) ...
if (root.document) {
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

      for (let tween in _tweens) {
        _tweens[tween]._startTime += timeDiff
      }
      _tick = _ticker(update)
      isStarted = true
    }

    return true
  })
}

export { Plugins, get, has, nextId, getAll, removeAll, remove, add, now, update, autoPlay, isRunning }
