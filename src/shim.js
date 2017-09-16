/* global global */
export let create = Object.create || ((source) => {
    return Object.assign({}, source || {});
});
export let assign = Object.assign || ((source, ...args) => {
    for (let i = 0, len = args.length; i < len; i++) {
        const arg = args[i];
        for (const p in arg) {
            source[p] = arg[p];
        }
    }
    return source;
});
if (!Array.isArray) {
    Array.isArray = (arg => arg && arg.push && arg.splice);
}
export let root = typeof (window) !== 'undefined' ? window : typeof (global) !== 'undefined' ? global : this;
export let requestAnimationFrame = root.requestAnimationFrame || (fn => root.setTimeout(fn, 16));
export let cancelAnimationFrame = root.cancelAnimationFrame || (id => root.clearTimeout(id));
