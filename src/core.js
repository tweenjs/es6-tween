/* global process */
import { requestAnimationFrame, cancelAnimationFrame, root } from './shim'

/**
 * Get browser/Node.js current time-stamp
 * @return Normalised current time-stamp in milliseconds
 * @memberof TWEEN
 * @example
 * TWEEN.now
 */
const now = (function () {
  if (
    typeof process !== 'undefined' &&
    process.hrtime !== undefined &&
    (!process.versions || process.versions.electron === undefined)
  ) {
    return function () {
      const time = process.hrtime()

      // Convert [seconds, nanoseconds] to milliseconds.
      return time[0] * 1000 + time[1] / 1000000
    }
    // In a browser, use window.performance.now if it is available.
  } else if (root.performance !== undefined && root.performance.now !== undefined) {
    // This must be bound, because directly assigning this function
    // leads to an invocation exception in Chrome.
    return root.performance.now.bind(root.performance)
    // Use Date.now if it is available.
  } else {
    const offset =
      root.performance && root.performance.timing && root.performance.timing.navigationStart
        ? root.performance.timing.navigationStart
        : Date.now()
    return function () {
      return Date.now() - offset
    }
  }
})()

/**
 * Lightweight, effecient and modular ES6 version of tween.js
 * @copyright 2019 @dalisoft and es6-tween contributors
 * @license MIT
 * @namespace TWEEN
 * @example
 * // ES6
 * const {add, remove, isRunning, autoPlay} = TWEEN
 */
const _tweens = []
let isStarted = false
let _autoPlay = false
let _onRequestTick = []
const _ticker = requestAnimationFrame
let emptyFrame = 0
let powerModeThrottle = 120
let _tick
let handleLag = true

const onRequestTick = (fn) => {
  _onRequestTick.push(fn)
}

const _requestTick = () => {
  for (let i = 0; i < _onRequestTick.length; i++) {
    _onRequestTick[i]()
  }
}

/**
 * Adds tween to list
 * @param {Tween} tween Tween instance
 * @memberof TWEEN
 * @example
 * let tween = new Tween({x:0})
 * tween.to({x:200}, 1000)
 * TWEEN.add(tween)
 */
const add = (tween) => {
  let i = _tweens.indexOf(tween)

  if (i > -1) {
    _tweens.splice(i, 1)
  }

  _tweens.push(tween)

  emptyFrame = 0

  if (_autoPlay && !isStarted) {
    _tick = _ticker(update)
    isStarted = true
  }
}

/**
 * Adds ticker like event
 * @param {Function} fn callback
 * @memberof TWEEN
 * @example
 * TWEEN.onTick(time => console.log(time))
 */
const onTick = (fn) => _tweens.push({ update: fn })

/**
 * Sets after how much frames empty updating should stop
 * @param {number} frameCount=120 count of frames that should stop after all tweens removed
 * @memberof TWEEN
 * @example
 * TWEEN.FrameThrottle(60)
 */
const FrameThrottle = (frameCount = 120) => {
  powerModeThrottle = frameCount * 1.05
}

/**
 * Handle lag, useful if you have rendering Canvas or DOM objects or using es6-tween plugins
 * @param {number} state=true handle lag state
 * @memberof TWEEN
 * @example
 * TWEEN.ToggleLagSmoothing(false)
 */
const ToggleLagSmoothing = (_state = true) => {
  handleLag = _state
}

/**
 * @returns {Array<Tween>} List of tweens in Array
 * @memberof TWEEN
 * TWEEN.getAll() // list of tweens
 */
const getAll = () => _tweens

/**
 * Runs update loop automaticlly
 * @param {Boolean} state State of auto-run of update loop
 * @example TWEEN.autoPlay(true)
 * @memberof TWEEN
 */
const autoPlay = (state) => {
  _autoPlay = state
}

/**
 * Removes all tweens from list
 * @example TWEEN.removeAll() // removes all tweens, stored in global tweens list
 * @memberof TWEEN
 */
const removeAll = () => {
  _tweens.length = 0
  cancelAnimationFrame(_tick)
  isStarted = false
}

/**
 * @param {Tween} tween Tween Instance to be matched
 * @return {Tween} Matched tween
 * @memberof TWEEN
 * @example
 * TWEEN.get(tween)
 */
const get = (tween) => {
  for (let i = 0; i < _tweens.length; i++) {
    if (tween === _tweens[i]) {
      return _tweens[i]
    }
  }

  return null
}

/**
 * @param {Tween} tween Tween Instance to be matched
 * @return {Boolean} Status of Exists tween or not
 * @memberof TWEEN
 * @example
 * TWEEN.has(tween)
 */
const has = (tween) => {
  return get(tween) !== null
}
/**
 * Removes tween from list
 * @param {Tween} tween Tween instance
 * @memberof TWEEN
 * @example
 * TWEEN.remove(tween)
 */
const remove = (tween) => {
  const i = _tweens.indexOf(tween)
  if (i !== -1) {
    _tweens.splice(i, 1)
  }
  if (_tweens.length === 0) {
    cancelAnimationFrame(_tick)
    isStarted = false
  }
}

/**
 * Updates global tweens by given time
 * @param {number=} time Timestamp
 * @param {Boolean=} preserve Prevents tween to be removed after finish
 * @memberof TWEEN
 * @example
 * TWEEN.update(500)
 */

const update = (time = now(), preserve) => {
  if (emptyFrame >= powerModeThrottle && handleLag) {
    isStarted = false
    emptyFrame = 0
    cancelAnimationFrame(_tick)
    return false
  }

  if (_autoPlay && isStarted) {
    _tick = _ticker(update)
  } else {
    _requestTick()
  }

  if (!_tweens.length) {
    emptyFrame++
  }

  let i = 0
  let length = _tweens.length
  while (i < length) {
    _tweens[i++].update(time, preserve)

    if (length > _tweens.length) {
      // The tween has been removed, keep same index
      i--
    }

    length = _tweens.length
  }

  return true
}

/**
 * The state of ticker running
 * @return {Boolean} Status of running updates on all tweens
 * @memberof TWEEN
 * @example TWEEN.isRunning()
 */
const isRunning = () => isStarted

/**
 * Returns state of lag smoothing handling
 * @return {Boolean} Status of lag smoothing state
 * @memberof TWEEN
 * @example TWEEN.isRunning()
 */
const isLagSmoothing = () => handleLag

/**
 * The plugins store object
 * @namespace TWEEN.Plugins
 * @memberof TWEEN
 * @example
 * let num = Plugins.num = function (node, start, end) {
 * return t => start + (end - start) * t
 * }
 *
 * @static
 */
const Plugins = {}

export {
  Plugins,
  get,
  has,
  getAll,
  removeAll,
  remove,
  add,
  now,
  update,
  autoPlay,
  onTick,
  onRequestTick,
  isRunning,
  isLagSmoothing,
  FrameThrottle,
  ToggleLagSmoothing
}
