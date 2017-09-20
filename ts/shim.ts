declare let global: any
/* global global */

export let create = Object.create || ((source: object): Object => {
  return Object.assign({}, source || {})
})
export let assign = Object.assign || ((source: object, ...args): Object => {
  for (let i = 0, len = args.length; i < len; i++) {
    const arg = args[i]
    for (const p in arg) {
      source[p] = arg[p]
    }
  }
  return source
})
export let root:any = typeof (window) !== 'undefined' ? window : typeof (global) !== 'undefined' ? global : this
export let requestAnimationFrame: Function = root.requestAnimationFrame || ((fn: Function): number => root.setTimeout(fn, 16))
export let cancelAnimationFrame: Function = root.cancelAnimationFrame || ((id: Function): boolean => root.clearTimeout(id))
