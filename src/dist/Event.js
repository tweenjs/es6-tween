/**
 * Events class
 * @example
 * let ev = new EventClass()
 * ev.on('listen', name => `Hello ${name}`)
 * ev.emit('listen', 'World')
 */

export default class EventClass {
  constructor () {
    this._events = {}
  }

  /**
   * Adds `event` to Events system
   * @param {String} event - Event listener name
   * @param {Function} callback - Event listener callback
   */
  on (event, callback) {
    if (!this._events[event]) {
      this._events[event] = []
    }

    this._events[event].push(callback)
    return this
  }


  /**
   * Adds `event` to Events system.
   * Removes itself after fired once
   * @param {String} event - Event listener name
   * @param {Function} callback - Event listener callback
   */
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

  /**
   * Removes `event` from Events system
   * @param {String} event - Event listener name
   * @param {Function} callback - Event listener callback
   */
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

  /**
   * Emits/Fired/Trigger `event` from Events system listeners
   * @param {String} event - Event listener name
   */
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
