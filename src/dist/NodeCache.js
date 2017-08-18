let Store = {}
export default function (node, tween) {
  if (!node) return tween
  if (Store[node]) {
    if (tween) {
      return Object.assign(Store[node], tween)
    }
    return Store[node]
  }

  Store[node] = tween
  return Store[node]
};
