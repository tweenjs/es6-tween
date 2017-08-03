import toNumber from './toNumber'

let colorMatch = /rgb|hsl|hsv/g
let isIncrementReqForColor = /ahsv|ahsl|argb/g

// Credits:
// @jkroso for string parse library
// Optimized, Extended by @dalisoft
const numRegExp =
  /\s+|([A-Za-z?().,{}:""[\]#]+)|([-+/*%]+=)?([-+*/%]+)?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g
let hexColor = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i
let trimRegExp = /\n|\r|\t/g
let hexReplace = (all, hex) => {
  let r
  let g
  let b
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = parseInt(hex.substr(0, 2), 16)
    g = parseInt(hex.substr(2, 2), 16)
    b = parseInt(hex.substr(4, 6), 16)
  }

  return `rgb(${r},${g},${b})`
}
let trim = str => typeof str === 'string' ? str.replace(trimRegExp, '') : str

const SubTween = (start, end, roundv = 10000) => {
  if (typeof end === 'function' || (end && end.nodeType)) {
    return end
  } else if (start && start.nodeType) {
    return start
  } else if (Array.isArray(start)) {
    let isColorPropsExist = null
    let startIndex = null
    end = end.map((v, i) => typeof v === 'string' && colorMatch.test(v) ? ((isColorPropsExist = v), (startIndex = i), null) : v === start[i] ? null : typeof v === 'number' ? (v - start[i]) : typeof v === 'string' && numRegExp.test(v) ? SubTween(trim(start[i]), trim(v)) : SubTween(start[i], v))
    let endIndex = startIndex !== null ? startIndex + 6 : null
    if (isColorPropsExist && isIncrementReqForColor.test(isColorPropsExist)) {
      startIndex++
      endIndex++
    }

    let map = [...start]
    return (t) => {
      for (let i = 0, v, length = end.length; i < length; i++) {
        v = end[i]
        if (typeof v === 'function') {
          map[i] = v(t)
        } else if (typeof v === 'number') {
          map[i] = (((start[i] + v * t) * roundv) | 0) / roundv

          if (startIndex !== null && i > startIndex && i < endIndex) {
            map[i] = map[i] | 0
          }
        }
      }

      return map
    }
  } else if (typeof start === 'object') {
    for (let property in end) {
      if (end[property] === start[property]) {
        end[property] = null
      } else if (typeof start[property] === 'number') {
        end[property] -= start[property]
      } else if (typeof end[property] === 'object' || (typeof end[property] === 'string' && numRegExp.test(end[property]))) {
        end[property] = SubTween(start[property], end[property])
      }
    }

    let map = {...start}
    return (t) => {
      for (let property in end) {
        let to = end[property]
        if (typeof to === 'function') {
          map[property] = to(t)
        } else if (typeof to === 'number') {
          map[property] = (((start[property] + to * t) * roundv) | 0) / roundv
        }
      }

      return map
    }
  } else if (typeof start === 'number') {
    end -= start
    let isSame = start === end
    return (t) => {
      return isSame ? end : (((start + end * t) * roundv) | 0) / roundv
    }
  } else if ((typeof start === 'string' && typeof end === 'string' && numRegExp.test(start) && numRegExp.test(end)) || (typeof end === 'string' && start && (hexColor.test(start) || hexColor.test(end)))) {
    let _startMap = trim(start).replace(hexColor, hexReplace).match(numRegExp).map(toNumber)
    let _endMap = trim(end).replace(hexColor, hexReplace).match(numRegExp).map(toNumber)
    let _tween = SubTween(_startMap, _endMap)
    return (t) => {
      let _t = _tween(t)
      let i = 0
      let s = ''
      while (i < _t.length) {
        s += _t[i]
        i++
      }

      return s
    }
  } else if (!Array.isArray(start) && Array.isArray(end)) {
    end.unshift(start)
    end.push(end[end.length - 1])
    return end.map((v, i) => SubTween(i === 0 ? start : end[i - 1], v))
  } else {
    return end
  }
}

export default SubTween
