/**
 * Morph plug-in for ES6 tween
 * (c) 2017, @dalisoft
 * Licensed under MIT-License
 */
import {
  moveIndex,
  reverse,
  autoFix
} from 'points.js'
import {
  toPoints,
  toPath as toD
} from 'svg-points'
import {
  nodeFetch
} from './js/helpers'
import {
  Plugins,
  Interpolator
} from 'es6-tween'
import {
  default as toPath
} from './js/interpolatePath'
import flubber from 'flubber'
/* global SVGElement, SVGPathElement */
let isSVGSupport = typeof (window) !== 'undefined' && !!window.SVGElement
if (!isSVGSupport) {
  throw new Error('SVG Support requires to work this plug-in')
}
const ns = 'http://www.w3.org/2000/svg'
Plugins.morph = {
  init: function (start, end) {
    let t = this.node
    let node = t instanceof SVGElement ? t : t.node
    let style1 = {}
    let attr1 = {}
    let style2 = {}
    let attr2 = {}
    let fixParam = {closerBound: true}
    let shape1 = nodeFetch(start && start.shape ? start.shape : start || node, style1, attr1)
    let shape2 = nodeFetch(end && end.shape ? end.shape : end, style2, attr2)
    if (start.approximate || end.approximate) {
      if (typeof flubber !== 'undefined') {
        fixParam.approximate = true
        fixParam.useAsArray = true
        if (start.closerBound === false || !end.closerBound === false) {
          fixParam.closerBound = false
        }
      } else {
        console.error(`ES6 Tween [Plugin::Morph]: The dependecy "flubber" requires for working super-fluid animations, please add it to your page.
        "flubber" can transite without our library too, try it...`)
      }
    }
    let shapeId1 = toPoints(shape1)
    let shapeId2 = toPoints(shape2)
    if (start && start.moveIndex) {
      shapeId1 = moveIndex(shapeId1, start.moveIndex)
    }
    if (end && end.moveIndex) {
      shapeId2 = moveIndex(shapeId2, end.moveIndex)
    }
    if (start && start.reverse) {
      shapeId1 = reverse(shapeId1)
    }
    if (end && end.reverse) {
      shapeId2 = reverse(shapeId2)
    }
    let [a, b] = autoFix(shapeId1, shapeId2, fixParam)
    if (fixParam.useAsArray) {
      this.__flubber = flubber.interpolateAll(a, b, { single: true })
    }
    if (node instanceof SVGElement && !(node instanceof SVGPathElement)) {
      let path = document.createElementNS(ns, 'path')
      for (let p in attr1) {
        path.setAttribute(p, attr1[p])
      }
      path.setAttribute('d', this.__flubber ? this.__flubber(0) : toD(a))
      if (node.parentNode) {
        node.parentNode.replaceChild(path, node)
        node = null
        node = path
      }
    }
    this.style = Interpolator(style1, style2)
    this.__fromPoints = a
    this.__toPoints = b
    return this
  },
  update: function (currentValue, start, end, v) {
    let d = this.__flubber ? this.__flubber(v) : toPath(this.__fromPoints, this.__toPoints, v)
    let s = this.style(v)
    let node = this.node
    node.setAttribute('d', d)
    for (const p in s) {
      node.style[p] = s[p]
    }
  }
}

export default Plugins.morph
