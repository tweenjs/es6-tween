/* global global */
export let create = Object.create || function (source) {
  return Object.assign({}, source || {})
}
export let assign = Object.assign || function (source, ...args) {
  for (let i = 0, len = args.length; i < len; i++) {
    let arg = args[i]
    for (let p in arg) {
      source[p] = arg[p]
    }
  }
  return source
}

if (!Array.isArray) {
  Array.isArray = source => source && source.push && source.splice
}
export let root = typeof (window) !== 'undefined' ? window : typeof (global) !== 'undefined' ? global : this
export let requestAnimationFrame = root.requestAnimationFrame || function (fn) { return root.setTimeout(fn, 16) }
export let cancelAnimationFrame = root.cancelAnimationFrame || function (id) { return root.clearTimeout(id) }
