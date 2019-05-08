export default function (selector, collection, allowRaw) {
  if (collection) {
    return !selector
      ? null
      : (typeof window !== 'undefined' && selector === window) ||
        (typeof document !== 'undefined' && selector === document)
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
  return !selector
    ? null
    : (typeof window !== 'undefined' && selector === window) ||
      (typeof document !== 'undefined' && selector === document)
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
