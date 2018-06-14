/**
 * 获取区间内的随机值
 * @param low 最小值
 * @param high 最大值
 */
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

/**
 * 获取 0~30° 之间的任意一个正负值
 */
function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

export { getRangeRandom, get30DegRandom}
