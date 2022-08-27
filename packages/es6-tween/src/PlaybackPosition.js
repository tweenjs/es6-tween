export default class PlaybackPosition {
  constructor () {
    this.totalTime = 0
    this.labels = []
    this.offsets = []
  }
  parseLabel (name, offset) {
    const { offsets, labels } = this
    let i = labels.indexOf(name)
    if (typeof name === 'string' && name.indexOf('=') !== -1 && !offset && i === -1) {
      const rty = name.substr(name.indexOf('=') - 1, 2)
      const rt = name.split(rty)
      offset = rt.length === 2 ? rty + rt[1] : null
      name = rt[0]
      i = labels.indexOf(name)
    }
    if (i !== -1 && name) {
      let currOffset = offsets[i] || 0
      if (typeof offset === 'number') {
        currOffset = offset
      } else if (typeof offset === 'string') {
        if (offset.indexOf('=') !== -1) {
          const type = offset.charAt(0)
          offset = Number(offset.substr(2))
          if (type === '+' || type === '-') {
            currOffset += parseFloat(type + offset)
          } else if (type === '*') {
            currOffset *= offset
          } else if (type === '/') {
            currOffset /= offset
          } else if (type === '%') {
            currOffset *= offset / 100
          }
        }
      }
      return currOffset
    }
    return typeof offset === 'number' ? offset : 0
  }
  addLabel (name, offset) {
    this.labels.push(name)
    this.offsets.push(this.parseLabel(name, offset))
    return this
  }
  setLabel (name, offset) {
    const i = this.labels.indexOf(name)
    if (i !== -1) {
      this.offsets.splice(i, 1, this.parseLabel(name, offset))
    }
    return this
  }
  eraseLabel (name) {
    const i = this.labels.indexOf(name)
    if (i !== -1) {
      this.labels.splice(i, 1)
      this.offsets.splice(i, 1)
    }
    return this
  }
}
