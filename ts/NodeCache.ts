import { remove } from './core';

export const Store = {};
export default function(node, object, tween) {
  if (!node || !node.nodeType) {
    return object;
  }
  const ID = node.queueID || 'q_' + Date.now();
  if (!node.queueID) {
    node.queueID = ID;
  }
  const storeID = Store[ID];
  if (storeID) {
    if (
      storeID.object === object &&
      node === storeID.tween.node &&
      tween._startTime === storeID.tween._startTime
    ) {
      remove(storeID.tween);
    } else {
      for (let prop in object) {
        if (prop in storeID.object) {
          if (tween._startTime === storeID.tween._startTime) {
            delete storeID.object[prop];
          } else {
            storeID.propNormaliseRequired = true;
          }
        }
      }
      return object;
    }
    return storeID.object;
  }

  Store[ID] = { tween, object, propNormaliseRequired: false };
  return Store[ID].object;
}
