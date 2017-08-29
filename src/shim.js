/* global global */
export let root = typeof (window) !== 'undefined' ? window : typeof (global) !== 'undefined' ? global : this

if (!Object.assign) {
  Object.assign = (source, ...args) => {
    for (let i = 0, len = args.length; i < len; i++) {
      let arg = args[i]
      for (let p in arg) {
        source[p] = arg[p]
      }
    }
    return source
  }
}
if (!Object.create) {
  Object.create = source => {
    return Object.assign({}, source || {})
  }
}
if (!Array.isArray) {
  Array.isArray = source => source && source.push && source.splice
}
if (typeof (requestAnimationFrame) === 'undefined') {
  root.requestAnimationFrame = fn => root.setTimeout(fn, 16)
}
if (typeof (cancelAnimationFrame) === 'undefined') {
  root.cancelAnimationFrame = id => root.clearTimeout(id)
}
