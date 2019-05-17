// Frame lag-fix constants
export const FRAME_MS = 50 / 3
export const TOO_LONG_FRAME_MS = 250

export const CHAINED_TWEENS = '_chainedTweens'

// Event System
export const EVENT_CALLBACK = 'Callback'
export const EVENT_UPDATE = 'update'
export const EVENT_COMPLETE = 'complete'
export const EVENT_START = 'start'
export const EVENT_REPEAT = 'repeat'
export const EVENT_REVERSE = 'reverse'
export const EVENT_PAUSE = 'pause'
export const EVENT_PLAY = 'play'
export const EVENT_RESTART = 'restart'
export const EVENT_STOP = 'stop'
export const EVENT_SEEK = 'seek'

// For String tweening stuffs
export const STRING_PROP = 'STRING_PROP'
// Also RegExp's for string tweening
export const NUM_REGEX = /\s+|([A-Za-z?().,{}:""[\]#%]+)|([-+]=+)?([-+]+)?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]=?\d+)?/g

// Copies everything, duplicates, no shallow-copy
export function deepCopy (source) {
  if ((source && source.nodeType) || source === undefined || typeof source !== 'object') {
    return source
  } else if (Array.isArray(source)) {
    return [].concat(source)
  } else if (typeof source === 'object') {
    let target = {}
    for (let prop in source) {
      target[prop] = deepCopy(source[prop])
    }
    return target
  }
  return source
}

const isNaNForST = (v) => isNaN(+v) || ((v[0] === '+' || v[0] === '-') && v[1] === '=') || v === '' || v === ' '

const hexColor = /^#([0-9a-f]{6}|[0-9a-f]{3})$/gi
const hex2rgb = (all, hex) => {
  let r
  let g
  let b
  if (hex.length === 3) {
    r = hex[0]
    g = hex[1]
    b = hex[2]
    hex = r + r + g + g + b + b
  }
  let color = parseInt(hex, 16)
  r = (color >> 16) & 255
  g = (color >> 8) & 255
  b = color & 255
  return 'rgb(' + r + ', ' + g + ', ' + b + ')'
}

export function decomposeString (fromValue) {
  if (fromValue && fromValue.splice && fromValue.isString) {
    return fromValue
  }
  if (typeof fromValue !== 'string') {
    return fromValue
  }
  if (fromValue.charAt(1) === '=') {
    return fromValue
  }
  const value = fromValue
    .replace(hexColor, hex2rgb)
    .match(NUM_REGEX)
    .map((v) => (isNaNForST(v) ? v : +v))
  value.isString = true
  return value
}

// Decompose value, now for only `string` that required
export function decompose (prop, obj, from, to) {
  const fromValue = from[prop]
  const toValue = to[prop]

  if (fromValue === toValue) {
    return true
  } else if (Array.isArray(fromValue) && Array.isArray(toValue) && fromValue.length === toValue.length) {
    for (let i = 0, len = toValue.length; i < len; i++) {
      const a = fromValue[i]
      const b = toValue[i]

      if (a === b || (typeof a === 'number' && typeof b === 'number')) {
        continue
      } else {
        decompose(i, obj[prop], fromValue, toValue)
      }
    }
  }
  if (typeof fromValue === 'number' && typeof toValue === 'number') {
    //
  } else if (fromValue && fromValue.splice && fromValue.isString && toValue && toValue.splice && toValue.isString) {
  } else if (typeof fromValue === 'string' && Array.isArray(toValue)) {
    const fromValue1 = decomposeString(fromValue)
    const toValues = toValue.map(decomposeString)

    from[prop] = fromValue1
    to[prop] = toValues
    return true
  } else if (typeof fromValue === 'string' || typeof toValue === 'string') {
    let fromValue1 = Array.isArray(fromValue) && fromValue[0] === STRING_PROP ? fromValue : decomposeString(fromValue)
    let toValue1 = Array.isArray(toValue) && toValue[0] === STRING_PROP ? toValue : decomposeString(toValue)

    if (fromValue1 === undefined) {
      return
    }
    let i = 1
    while (i < fromValue1.length) {
      if (fromValue1[i] === toValue1[i] && typeof fromValue1[i - 1] === 'string') {
        fromValue1.splice(i - 1, 2, fromValue1[i - 1] + fromValue1[i])
        toValue1.splice(i - 1, 2, toValue1[i - 1] + toValue1[i])
      } else {
        i++
      }
    }

    i = 0

    if (fromValue1[0] === STRING_PROP) {
      fromValue1.shift()
    }
    if (toValue1[0] === STRING_PROP) {
      toValue1.shift()
    }

    from[prop] = fromValue1
    to[prop] = toValue1
    return true
  } else if (typeof fromValue === 'object' && typeof toValue === 'object') {
    if (Array.isArray(fromValue) && !fromValue.isString) {
      return fromValue.map((v, i) => decompose(i, obj[prop], fromValue, toValue))
    } else {
      for (let prop2 in toValue) {
        decompose(prop2, obj[prop], fromValue, toValue)
      }
    }
    return true
  }
  return false
}

// Recompose value
export const RGB = 'rgb('
export const RGBA = 'rgba('

export const isRGBColor = (v, i, r = RGB) =>
  typeof v[i] === 'number' && (v[i - 1] === r || v[i - 3] === r || v[i - 5] === r)
export function recompose (prop, obj, from, to, t, originalT, stringBuffer) {
  const fromValue = stringBuffer ? from : from[prop]
  let toValue = stringBuffer ? to : to[prop]
  if (toValue === undefined) {
    return fromValue
  }
  if (fromValue === undefined || typeof fromValue === 'string' || fromValue === toValue) {
    return toValue
  } else if (typeof fromValue === 'object' && typeof toValue === 'object') {
    if (!fromValue || !toValue) {
      return obj[prop]
    }
    if (
      typeof fromValue === 'object' &&
      !!fromValue &&
      fromValue.isString &&
      toValue &&
      toValue.splice &&
      toValue.isString
    ) {
      let STRING_BUFFER = ''
      for (let i = 0, len = fromValue.length; i < len; i++) {
        if (fromValue[i] !== toValue[i] || typeof fromValue[i] !== 'number' || typeof toValue[i] === 'number') {
          const isRelative = typeof fromValue[i] === 'number' && typeof toValue[i] === 'string' && toValue[i][1] === '='
          let currentValue =
            typeof fromValue[i] !== 'number'
              ? fromValue[i]
              : isRelative
                ? fromValue[i] + parseFloat(toValue[i][0] + toValue[i].substr(2)) * t
                : fromValue[i] + (toValue[i] - fromValue[i]) * t
          if (isRGBColor(fromValue, i) || isRGBColor(fromValue, i, RGBA)) {
            currentValue |= 0
          }
          STRING_BUFFER += currentValue
          if (isRelative && originalT === 1) {
            fromValue[i] = fromValue[i] + parseFloat(toValue[i][0] + toValue[i].substr(2))
          }
        } else {
          STRING_BUFFER += fromValue[i]
        }
      }
      if (!stringBuffer) {
        obj[prop] = STRING_BUFFER
      }
      return STRING_BUFFER
    } else if (Array.isArray(fromValue) && fromValue[0] !== STRING_PROP) {
      for (let i = 0, len = fromValue.length; i < len; i++) {
        if (fromValue[i] === toValue[i] || typeof obj[prop] === 'string') {
          continue
        }
        recompose(i, obj[prop], fromValue, toValue, t, originalT)
      }
    } else if (typeof fromValue === 'object' && !!fromValue && !fromValue.isString) {
      for (let i in fromValue) {
        if (fromValue[i] === toValue[i]) {
          continue
        }
        recompose(i, obj[prop], fromValue, toValue, t, originalT)
      }
    }
  } else if (typeof fromValue === 'number') {
    const isRelative = typeof toValue === 'string'
    obj[prop] = isRelative
      ? fromValue + parseFloat(toValue[0] + toValue.substr(2)) * t
      : fromValue + (toValue - fromValue) * t
    if (isRelative && originalT === 1) {
      from[prop] = obj[prop]
    }
  } else if (typeof toValue === 'function') {
    obj[prop] = toValue(t)
  }
  return obj[prop]
}

// Dot notation => Object structure converter
// example
// {'scale.x.y.z':'VALUE'} => {scale:{x:{y:{z:'VALUE'}}}}
// Only works for 3-level parsing, after 3-level, parsing dot-notation not works as it's not affects
const propRegExp = /([.[])/g
const replaceBrace = /\]/g
const propExtract = function (obj, property) {
  const value = obj[property]
  const props = property.replace(replaceBrace, '').split(propRegExp)
  const propsLastIndex = props.length - 1
  let lastArr = Array.isArray(obj)
  let lastObj = typeof obj === 'object' && !lastArr
  if (lastObj) {
    obj[property] = null
    delete obj[property]
  } else if (lastArr) {
    obj.splice(property, 1)
  }
  return props.reduce((nested, prop, index) => {
    if (lastArr) {
      if (prop !== '.' && prop !== '[') {
        prop *= 1
      }
    }
    let nextProp = props[index + 1]
    let nextIsArray = nextProp === '['
    if (prop === '.' || prop === '[') {
      if (prop === '.') {
        lastObj = true
        lastArr = false
      } else if (prop === '[') {
        lastObj = false
        lastArr = true
      }
      return nested
    } else if (nested[prop] === undefined) {
      if (lastArr || lastObj) {
        nested[prop] = index === propsLastIndex ? value : lastArr || nextIsArray ? [] : lastObj ? {} : null
        lastObj = lastArr = false
        return nested[prop]
      }
    } else if (nested[prop] !== undefined) {
      if (index === propsLastIndex) {
        nested[prop] = value
      }
      return nested[prop]
    }
    return nested
  }, obj)
}

export const SET_NESTED = function (nested) {
  if (typeof nested === 'object' && !!nested) {
    for (let prop in nested) {
      if (prop.indexOf('.') !== -1 || prop.indexOf('[') !== -1) {
        propExtract(nested, prop)
      } else if (typeof nested[prop] === 'object' && !!nested[prop]) {
        let nested2 = nested[prop]
        for (let prop2 in nested2) {
          if (prop2.indexOf('.') !== -1 || prop2.indexOf('[') !== -1) {
            propExtract(nested2, prop2)
          } else if (typeof nested2[prop2] === 'object' && !!nested2[prop2]) {
            let nested3 = nested2[prop2]
            for (let prop3 in nested3) {
              if (prop3.indexOf('.') !== -1 || prop3.indexOf('[') !== -1) {
                propExtract(nested3, prop3)
              }
            }
          }
        }
      }
    }
  }
  return nested
}
