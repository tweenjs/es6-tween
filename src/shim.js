/* global global, self */
export let root =
  typeof self !== 'undefined'
    ? self
    : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : this || (typeof exports !== 'undefined' ? exports : {})
export let requestAnimationFrame = root.requestAnimationFrame || ((fn) => root.setTimeout(fn, 50 / 3))
export let cancelAnimationFrame = root.cancelAnimationFrame || ((id) => root.clearTimeout(id))
