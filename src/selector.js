export default function (selector, collection, allowRaw) {
  if (!selector) {
    return null
  }

  const isGlobalScope =
    (typeof window !== 'undefined' && selector === window) ||
    (typeof document !== 'undefined' && selector === document)

  if (collection) {
    return isGlobalScope
      ? [selector]
      : typeof selector === 'string'
        ? !!document.querySelectorAll && document.querySelectorAll(selector)
        : Array.isArray(selector)
          ? selector
          : selector.nodeType
            ? [selector]
            : allowRaw
              ? selector
              : []
  }
  return isGlobalScope
    ? selector
    : typeof selector === 'string'
      ? !!document.querySelector && document.querySelector(selector)
      : Array.isArray(selector)
        ? selector[0]
        : selector.nodeType
          ? selector
          : allowRaw
            ? selector
            : null
}
