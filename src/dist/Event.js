const bind = (fn, ctx) => {
  return function () {
    return fn.apply(ctx, arguments)
  }
}

export default class EventClass {
  constructor () {
    this._events = {}
    this._bind = this
    this.on = bind(this.on, this)
    this.once = bind(this.once, this)
    this.off = bind(this.off, this)
    this.emit = bind(this.emit, this)
  }

  bind (scope) {
    this._bind = scope
    return this
  }

  on (event, callback) {
    if (!this._events[event]) {
      this._events[event] = []
    }

    this._events[event].push(callback)
    return this
  }

  once (event, callback) {
    if (!this._events[event]) {
      this._events[event] = []
    }

    let {_events, _bind} = this
    let spliceIndex = _events[event].length
    this._events[event].push((...args) => {
      callback.apply(_bind, args)
      _events[event].splice(spliceIndex, 1)
    })
    return this
  }

  off (event, callback) {
    let {_events} = this

    if (event === undefined || !_events[event]) {
      return this
    }

    if (callback) {
      this._events[event] = this._events[event].filter(cb => cb !== callback)
    } else {
      this._events[event].length = 0
    }

    return this
  }

  emit (event, arg1, arg2, arg3, arg4) {
    let {_events, _bind} = this

    if (event === undefined || !_events[event]) {
      return this
    }

    let _event = _events[event]

    for (let i = 0, length = _event.length; i < length; i++) {
      _event[i].call(_bind, arg1, arg2, arg3, arg4)
    }
  }
}
