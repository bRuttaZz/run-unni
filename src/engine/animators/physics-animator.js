/**
 * Apply physics (gravity & collision)
 * @param {Number} zindex - zindex of objects
 * @param {Array<GameObject>} items - game objects
 */
export function physicsAnimator(zindex, items) {
  const _toRemove = [];
  items.forEach((item, i) => {
    item.calcMotion();

    // collision calculation
    if (zindex > 0) {
      item.isHorizontalCollided = false;
      item.isVerticalCollided = false;
      item.isCollided = false;
      items.slice(i + 1).forEach((obj) => item.calcCollition(obj));
    }
    const del = item.wrap();
    if (!del) {
      _toRemove.push(item.id);
    }
  });
  if (_toRemove.length) console.debug("items removed from track :", _toRemove); // TODO: remove this debug message

  _toRemove.forEach((id) => {
    const i = items.findIndex(item => item.id == id);
    if (i !== -1) items.splice(i, 1)[0].dispatchEvent(new Event("deleted"))
  })
}
