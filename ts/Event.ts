/**
 * Events class
 * @constructor
 * @class
 * @namespace EventClass
 * @example
 * let ev = new EventClass()
 * ev.on('listen', name => `Hello ${name}`)
 * ev.emit('listen', 'World')
 */

class EventClass {
  private _events: Object
  constructor() {
    this._events = {}
  }

  /**
   * Adds `event` to Events system
   * @param {string} event - Event listener name
   * @param {Function} callback - Event listener callback
   * @memberof EventClass
   */
  public on(event: string, callback: Function) {
    if (!this._events[event]) {
      this._events[event] = [] as Function[]
    }

    this._events[event].push(callback)
    return this
  }

  /**
   * Adds `event` to Events system.
   * Removes itself after fired once
   * @param {string} event - Event listener name
   * @param {Function} callback - Event listener callback
   * @memberof EventClass
   */
  public once(event: string, callback: Function) {
    if (!this._events[event]) {
      this._events[event] = [] as Function[]
    }

    const { _events } = this
    const spliceIndex = _events[event].length
    this._events[event].push((...args) => {
      callback.apply(this, args)
      _events[event].splice(spliceIndex, 1)
    })
    return this
  }

  /**
   * Removes `event` from Events system
   * @param {string} event - Event listener name
   * @param {Function} callback - Event listener callback
   * @memberof EventClass
   */
  public off(event: string, callback: Function) {
    const { _events } = this

    if (event === undefined || !_events[event]) {
      return this
    }

    if (callback) {
      this._events[event] = this._events[event].filter((cb: Function): boolean => cb !== callback)
    } else {
      this._events[event].length = 0
    }

    return this
  }

  /**
   * Emits/Fired/Trigger `event` from Events system listeners
   * @param {string} event - Event listener name
   * @memberof EventClass
   */
  public emit(event: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
    const { _events } = this

    const _event = _events[event]

    if (!_event || !_event.length) {
      return this
    }

    let i: number = 0
    const len: number = _event.length
    for (; i < len; i++) {
      _event[i](arg1, arg2, arg3, arg4)
    }
    return this
  }
}

export default EventClass
