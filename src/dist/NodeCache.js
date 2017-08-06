let Store = {}
export default function (node, tween) {
  if (!node) return tween
  if (Store[node]) {
    if (tween) {
      return tween
    }
    return Store[node]
  }

  Store[node] = tween
  return Store[node]
};
