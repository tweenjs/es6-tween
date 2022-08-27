import { isRGBColor, RGBA, STRING_PROP } from './constants'

/**
 * List of full Interpolation
 * @namespace TWEEN.Interpolation
 * @example
 * import {Interpolation, Tween} from 'es6-tween'
 *
 * let bezier = Interpolation.Bezier
 * new Tween({x:0}).to({x:[0, 4, 8, 12, 15, 20, 30, 40, 20, 40, 10, 50]}, 1000).interpolation(bezier).start()
 * @memberof TWEEN
 */
const Interpolation = {
  Linear (v, k, value) {
    const m = v.length - 1
    const f = m * k
    const i = Math.floor(f)
    const fn = Interpolation.Utils.Linear

    if (k < 0) {
      return fn(v[0], v[1], f, value)
    }
    if (k > 1) {
      return fn(v[m], v[m - 1], m - f, value)
    }
    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i, value)
  },

  Bezier (v, k, value) {
    let b = Interpolation.Utils.Reset(value)
    let n = v.length - 1
    let pw = Math.pow
    let fn = Interpolation.Utils.Bernstein

    let isBArray = Array.isArray(b)

    for (let i = 0; i <= n; i++) {
      if (typeof b === 'number') {
        b += pw(1 - k, n - i) * pw(k, i) * v[i] * fn(n, i)
      } else if (isBArray) {
        for (let p = 0, len = b.length; p < len; p++) {
          if (typeof b[p] === 'number') {
            b[p] += pw(1 - k, n - i) * pw(k, i) * v[i][p] * fn(n, i)
          } else {
            b[p] = v[i][p]
          }
        }
      } else if (typeof b === 'object') {
        for (let p in b) {
          if (typeof b[p] === 'number') {
            b[p] += pw(1 - k, n - i) * pw(k, i) * v[i][p] * fn(n, i)
          } else {
            b[p] = v[i][p]
          }
        }
      } else if (typeof b === 'string') {
        let STRING_BUFFER = ''
        let idx = Math.round(n * k)
        let vCurr = v[idx]
        for (let ks = 1, len = vCurr.length; ks < len; ks++) {
          STRING_BUFFER += vCurr[ks]
        }
        return STRING_BUFFER
      }
    }

    return b
  },

  CatmullRom (v, k, value) {
    const m = v.length - 1
    let f = m * k
    let i = Math.floor(f)
    const fn = Interpolation.Utils.CatmullRom

    if (v[0] === v[m]) {
      if (k < 0) {
        i = Math.floor((f = m * (1 + k)))
      }

      return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i, value)
    } else {
      if (k < 0) {
        return fn(v[1], v[1], v[0], v[0], -k, value)
      }

      if (k > 1) {
        return fn(v[m - 1], v[m - 1], v[m], v[m], (k | 0) - k, value)
      }

      return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i, value)
    }
  },

  Utils: {
    Linear (p0, p1, t, v) {
      if (p0 === p1 || typeof p0 === 'string') {
        // Quick return for performance reason
        if (p1.length && p1.splice && p1.isString) {
          p1 = ''
          for (let i = 0, len = p0.length; i < len; i++) {
            p1 += p0[i]
          }
        }
        return p1
      } else if (typeof p0 === 'number') {
        return typeof p0 === 'function' ? p0(t) : p0 + (p1 - p0) * t
      } else if (typeof p0 === 'object') {
        if (p0.length !== undefined) {
          const isForceStringProp = typeof p0[0] === 'string' || p0.isString
          if (isForceStringProp || p0[0] === STRING_PROP) {
            let STRING_BUFFER = ''
            for (let i = isForceStringProp ? 0 : 1, len = p0.length; i < len; i++) {
              let currentValue =
                t === 0 ? p0[i] : t === 1 ? p1[i] : typeof p0[i] === 'number' ? p0[i] + (p1[i] - p0[i]) * t : p1[i]
              if ((t > 0 && t < 1 && isRGBColor(p0, i)) || isRGBColor(p0, i, RGBA)) {
                currentValue |= 0
              }
              STRING_BUFFER += currentValue
            }
            return STRING_BUFFER
          } else if (v && v.length && v.splice) {
            for (let p = 0, len = v.length; p < len; p++) {
              v[p] = Interpolation.Utils.Linear(p0[p], p1[p], t, v[p])
            }
          }
        } else {
          for (const p in v) {
            v[p] = Interpolation.Utils.Linear(p0[p], p1[p], t, v[p])
          }
        }
        return v
      }
    },

    Reset (value) {
      if (Array.isArray(value)) {
        for (let i = 0, len = value.length; i < len; i++) {
          value[i] = Interpolation.Utils.Reset(value[i])
        }
        return value
      } else if (typeof value === 'object') {
        for (let i in value) {
          value[i] = Interpolation.Utils.Reset(value[i])
        }
        return value
      } else if (typeof value === 'number') {
        return 0
      }
      return value
    },

    Bernstein (n, i) {
      const fc = Interpolation.Utils.Factorial

      return fc(n) / fc(i) / fc(n - i)
    },

    Factorial: (function () {
      const a = [1]

      return (n) => {
        let s = 1

        if (a[n]) {
          return a[n]
        }

        for (let i = n; i > 1; i--) {
          s *= i
        }

        a[n] = s
        return s
      }
    })(),

    CatmullRom (p0, p1, p2, p3, t, v) {
      if (typeof p0 === 'string') {
        return p1
      } else if (typeof p0 === 'number') {
        const v0 = (p2 - p0) * 0.5
        const v1 = (p3 - p1) * 0.5
        const t2 = t * t
        const t3 = t * t2

        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
      } else if (typeof p0 === 'object') {
        if (p0.length !== undefined) {
          if (p0[0] === STRING_PROP) {
            let STRING_BUFFER = ''
            for (let i = 1, len = p0.length; i < len; i++) {
              let currentValue =
                typeof p0[i] === 'number' ? Interpolation.Utils.CatmullRom(p0[i], p1[i], p2[i], p3[i], t) : p3[i]
              if (isRGBColor(p0, i) || isRGBColor(p0, i, RGBA)) {
                currentValue |= 0
              }
              STRING_BUFFER += currentValue
            }
            return STRING_BUFFER
          }
          for (let p = 0, len = v.length; p < len; p++) {
            v[p] = Interpolation.Utils.CatmullRom(p0[p], p1[p], p2[p], p3[p], t, v[p])
          }
        } else {
          for (const p in v) {
            v[p] = Interpolation.Utils.CatmullRom(p0[p], p1[p], p2[p], p3[p], t, v[p])
          }
        }
        return v
      }
    }
  }
}

export default Interpolation
