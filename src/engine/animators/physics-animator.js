/**
 * Apply physics (gravity & collision)
 * @param {Number} zindex - zindex of objects
 * @param {Array<GameObject>} items - game objects
 */
export function physicsAnimator(zindex, items) {
  const _toRemove = [];
  items.forEach((item, i) => {
    item.calcMotion();
    if (zindex > 0)
      items.slice(i + 1).forEach((obj) => item.calcCollition(obj));
    const del = item.wrap();
    if (!del) {
      _toRemove.push(i);
    }
  });
  if (_toRemove.length) console.debug("items removed from track :", _toRemove); // TODO: remove this debug message
  _toRemove.forEach((i) => items.splice(i, 1));
}
