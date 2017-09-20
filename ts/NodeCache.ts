import { assign } from './shim'

const Store = {}
export default function (node, tween) {
  if (!node || !node.nodeType) {
    return tween
  }
  const ID = node.queueID || 'q_' + Date.now()
  if (!node.queueID) {
    node.queueID = ID
  }
  if (Store[ID]) {
    if (tween) {
      Store[ID] = tween//assign(Store[ID], tween)
    }
    return Store[ID]
  }

  Store[ID] = tween
  return Store[ID]
}
