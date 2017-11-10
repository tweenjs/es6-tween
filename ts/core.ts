/* global process */
import { cancelAnimationFrame, requestAnimationFrame, root } from './shim'

declare let process: any

/**
 * Get browser/Node.js current time-stamp
 * @return Normalised current time-stamp in milliseconds
 * @memberof TWEEN
 * @example
 * TWEEN.now
 */
const now: any = (function () {
  if (typeof (process) !== 'undefined' && process.hrtime !== undefined) {
    return function () {
      const time: number = process.hrtime()

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
    const offset: number = root.performance && root.performance.timing && root.performance.timing.navigationStart ? root.performance.timing.navigationStart : Date.now()
    return function () {
      return Date.now() - offset
    }
  }
}())

/**
 * Lightweight, effecient and modular ES6 version of tween.js
 * @copyright 2017 @dalisoft and es6-tween contributors
 * @license MIT
 * @namespace TWEEN
 * @example
 * // ES6
 * const {add, remove, isRunning, autoPlay} = TWEEN
 */
const _tweens: any[] = []
let isStarted: boolean = false
let _autoPlay: boolean = false
let _tick: Function
const _ticker: Function = requestAnimationFrame
const _stopTicker: Function = cancelAnimationFrame

/**
 * Adds tween to list
 * @param {Tween} tween Tween instance
 * @memberof TWEEN
 * @example
 * let tween = new Tween({x:0})
 * tween.to({x:200}, 1000)
 * TWEEN.add(tween)
 */
const add = (tween: any): void => {
  let i: number = _tweens.indexOf(tween)

  if (i > -1) {
    _tweens.splice(i, 1)
  }

  if (_tweens.length > 0) {
    i = _tweens.length - 1
    let tweenPrev = _tweens[i]
    tween.prev = tweenPrev
    tweenPrev.next = tween
  }

  _tweens.push(tween)

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
const onTick = (fn: Function) => _tweens.push({ update: fn })

/**
 * @returns {Array<Tween>} List of tweens in Array
 * @memberof TWEEN
 * TWEEN.getAll() // list of tweens
 */
const getAll = (): any[] => _tweens

/**
 * Runs update loop automaticlly
 * @param {Boolean} state State of auto-run of update loop
 * @example TWEEN.autoPlay(true)
 * @memberof TWEEN
 */
const autoPlay = (state: boolean): void => {
  _autoPlay = state
}

/**
 * Removes all tweens from list
 * @example TWEEN.removeAll() // removes all tweens, stored in global tweens list
 * @memberof TWEEN
 */
const removeAll = (): void => {
  _tweens.length = 0
}

/**
 * @param {Tween} tween Tween Instance to be matched
 * @return {Tween} Matched tween
 * @memberof TWEEN
 * @example
 * TWEEN.get(tween)
 */
const get = (tween: any): Function | null => {
  for (let i: number = 0; i < _tweens.length; i++) {
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
const has = (tween: any): boolean => {
  return get(tween) !== null
}
/**
 * Removes tween from list
 * @param {Tween} tween Tween instance
 * @memberof TWEEN
 * @example
 * TWEEN.remove(tween)
 */
const remove = (tween: any): void => {
  const i = _tweens.indexOf(tween)
  if (i !== -1) {
    _tweens.splice(i, 1)
  }
}

/**
 * Updates global tweens by given time
 * @param {number|Time} time Timestamp
 * @param {Boolean=} preserve Prevents tween to be removed after finish
 * @memberof TWEEN
 * @example
 * TWEEN.update(500)
 */

const update = (time: number, preserve?: boolean): boolean => {
  time = time !== undefined ? time : now()
  if (_autoPlay && isStarted) {
    _tick = _ticker(update)
  }

  if (!_tweens.length) {
    _stopTicker(_tick)
    isStarted = false
    return false
  }

  let i: number = 0
  let tween: any
  while (i < _tweens.length) {
    _tweens[i++].update(time, preserve)
  }

  return true
}

/**
 * The state of ticker running
 * @return {Boolean} Status of running updates on all tweens
 * @memberof TWEEN
 * @example TWEEN.isRunning()
 */
const isRunning = (): boolean => isStarted

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
const Plugins: Object = {}

export { Plugins, get, has, getAll, removeAll, remove, add, now, update, autoPlay, onTick, isRunning }
