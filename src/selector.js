export default function (selector, collection) {
  if (collection) {
    return !selector
      ? null
      : selector === window || selector === document
        ? [selector]
        : typeof selector === 'string'
          ? !!document.querySelectorAll && document.querySelectorAll(selector)
          : Array.isArray(selector)
            ? selector
            : selector.nodeType ? [selector] : []
  }
  return !selector
    ? null
    : selector === window || selector === document
      ? selector
      : typeof selector === 'string'
        ? !!document.querySelector && document.querySelector(selector)
        : Array.isArray(selector)
          ? selector[0]
          : selector.nodeType ? selector : null
}
