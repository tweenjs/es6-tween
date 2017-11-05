import { assign } from './shim'
import { remove } from './core'

const Store = {}
export default function (node, object, tween) {
  if (!node || !node.nodeType) {
    return object
  }
  const ID = node.queueID || 'q_' + Date.now()
  if (!node.queueID) {
    node.queueID = ID
  }
  const storeID = Store[ID]
  if (storeID) {
    if (storeID.object === object && node === storeID.tween.node) {
		remove(storeID.tween)
	} else {
		for (let prop in object) {
			if (prop in storeID.object) {
				if (tween.startTime === storeID.tween.startTime) {
					delete storeID.object[prop]
				}
			}
		}
		return object
    }
    return storeID.object
  }

  Store[ID] = { tween, object }
  return Store[ID]
}
