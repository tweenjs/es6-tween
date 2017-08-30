let Store = {}
export default function (node, tween) {
  if (!node || !node.nodeType) return tween
  var ID = node.queueID || 'queue_' + Math.round(Math.random() * 1000 + Date.now())
  if (!node.queueID) {
    node.queueID = ID
  }
  if (Store[ID]) {
    if (tween) {
      Store[ID] = Object.assign(Store[ID], tween)
    }
    return Store[ID]
  }

  Store[ID] = tween
  return Store[ID]
};
