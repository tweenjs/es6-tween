export default class EventClass {
  constructor () {
    this._events = {}
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

    let {_events} = this
    let spliceIndex = _events[event].length
    this._events[event].push((...args) => {
      callback.apply(this, args)
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
    let {_events} = this

    let _event = _events[event]

    if (!_event || !_event.length) {
      return this
    }

    let i = 0
    const len = _event.length
    for (; i < len; i++) {
      _event[i](arg1, arg2, arg3, arg4)
    }
  }
}
