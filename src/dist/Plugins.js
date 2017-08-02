const cache = {
  filter: {
    grayscale: 1,
    brightness: 1,
    sepia: 1,
    invert: 1,
    saturate: 1,
    contrast: 1,
    blur: 1,
    hueRotate: 1,
    dropShadow: 1
  },
  transform: {
    translate: 1,
    translateX: 1,
    translateY: 1,
    translateZ: 1,
    rotate: 1,
    rotateX: 1,
    rotateY: 1,
    rotateZ: 1,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    skew: 1,
    skewX: 1,
    skewY: 1,
    x: 1,
    y: 1,
    z: 1
  },
  scroll: {
    scrollTop: 1,
    scrollLeft: 1
  }
}

export { cache as PropertyTypes }

export default class Plugins {
  static Attr () {
    let layer = this.domNode
    return {
      update (RenderObject) {
        for (let p in RenderObject) {
          if (cache.transform[p] || cache.filter[p] || cache.scroll[p]) continue
          layer.setAttribute(p, RenderObject[p])
        }
      }
    }
  }

  static Style () {
    let layer = this.domNode
    let style = layer.style
    return {
      update (RenderObject) {
        for (let p in RenderObject) {
          if (cache.transform[p] || cache.filter[p]) continue
          style[p] = RenderObject[p]
        }
      }
    }
  }

  static Transform () {
    let layer = this.domNode
    let style = layer.style
    return {
      update (RenderObject) {
        let transform = ''
        for (let p in RenderObject) {
          if (!cache.transform[p]) continue
          if (p === 'x' || p === 'y' || p === 'z') {
            transform += ' translate3d( ' + (RenderObject.x || '0px') + ', ' + (RenderObject.y || '0px') + ', ' + (RenderObject.z || '0px') + ')'
          } else if (cache.transform[p]) {
            transform += ` ${p}( ${RenderObject[p]})`
          }
        }

        if (transform) {
          style.transform = transform
        }
      }
    }
  }

  static SVGTransform (xPos, yPos) {
    let layer = this.domNode
    let bbox = {}
    let self = null
    let attrName = 'transform'
    let rotate = 'rotate'
    let x = 'x'
    let y = 'y'
    return (self = {
      update (RenderObject) {
        let transform = ''
        for (let p in RenderObject) {
          if (!cache[attrName][p]) continue
          if (bbox.x === undefined || bbox.y === undefined) {
            self.setOrigin(xPos, yPos)
            continue
          }

          if (p === rotate) {
            transform += ` rotate(${RenderObject[p]} ${bbox.x} ${bbox.y})`
          } else if (p === x || p === y) {
            transform += ` translate(${RenderObject.x || 0}, ${RenderObject.y || 0})`
          } else {
            transform += ` ${p}(${RenderObject[p]})`
          }
        }

        if (transform) {
          layer.setAttribute(attrName, transform)
        }

        return self
      },

      init () {
        return self.setOrigin(xPos, yPos)
      },

      setOrigin (x, y) {
        let {width, height, left, top} = layer.getBoundingClientRect()

        x = typeof (x) === 'number' ? left + x : typeof x === 'string' && x.indexOf('%') > -1 ? left + (width * (parseFloat(x) / 100)) : left + (width / 2)
        y = typeof (y) === 'number' ? left + y : typeof y === 'string' && y.indexOf('%') > -1 ? top + (height * (parseFloat(y) / 100)) : top + (height / 2)

        if (bbox.x !== undefined && bbox.y !== undefined) {
          let diffX = bbox.x - x
          let diffY = bbox.y - y

          x += x - diffX
          y += y - diffY
        }

        bbox.x = x
        bbox.y = y

        return self
      }
    })
  }

  static Filter () {
    let layer = this.domNode
    let style = layer.style
    return {
      update (RenderObject) {
        let filter = ''
        for (let p in RenderObject) {
          if (!cache.filter[p]) continue
          if (cache.filter[p]) {
            filter += ` ${p}( ${RenderObject[p]})`
          }
        }

        if (filter) {
          style.webkitFilter = style.filter = filter
        }
      }
    }
  }

  static Scroll () {
    let layer = this.domNode
    return {
      update: (RenderObject) => {
        for (let p in RenderObject) {
          if (!cache.scroll[p]) continue
          layer[p] = RenderObject[p]
        }
      }
    }
  }
}
