const Store = {
  add: function (tween) {
    if (Store[tween] && JSON.stringify(tween) && JSON.stringify(Store[tween])) {
      return Store[tween]
    }

    Store[tween] = tween
    return tween
  }
}

export default Store
