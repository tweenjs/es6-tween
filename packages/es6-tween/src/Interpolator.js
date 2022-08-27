import { decompose, recompose, decomposeString } from './constants'

/**
 * Tween helper for plugins
 * @namespace TWEEN.Interpolator
 * @memberof TWEEN
 * @param {any} a - Initial position
 * @param {any} b - End position
 * @return {Function} Returns function that accepts number between `0-1`
 */
const Interpolator = (a, b) => {
  let isArray = Array.isArray(a) && !a.isString
  let origin = typeof a === 'string' ? a : isArray ? a.slice() : { ...a }
  if (isArray) {
    for (let i = 0, len = a.length; i < len; i++) {
      if (a[i] !== b[i] || typeof a[i] !== 'number' || typeof b[i] === 'number') {
        decompose(i, origin, a, b)
      }
    }
  } else if (typeof a === 'object') {
    for (let i in a) {
      if (a[i] !== b[i] || typeof a[i] !== 'number' || typeof b[i] === 'number') {
        decompose(i, origin, a, b)
      }
    }
  } else if (typeof a === 'string') {
    a = decomposeString(a)
    b = decomposeString(b)

    let i = 1
    while (i < a.length) {
      if (a[i] === b[i] && typeof a[i - 1] === 'string') {
        a.splice(i - 1, 2, a[i - 1] + a[i])
        b.splice(i - 1, 2, b[i - 1] + b[i])
      } else {
        i++
      }
    }
  }
  return (t) => {
    if (isArray) {
      for (let i = 0, len = a.length; i < len; i++) {
        recompose(i, origin, a, b, t)
      }
    } else if (typeof origin === 'object') {
      for (let i in a) {
        recompose(i, origin, a, b, t)
      }
    } else if (typeof origin === 'string') {
      origin = recompose(0, 0, a, b, t, t, true)
    }
    return origin
  }
}

export default Interpolator
