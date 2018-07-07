/**
 * 数据存储
 * id 商家ID
 * key 该上加下一些属性的key
 * value key对应的value
 */
export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  // 将对象编码成字符串存入
  window.localStorage.__seller__ = JSON.stringify(seller)
}

/**
 * 数据读取
 * id 商家ID
 * key 不用ID时可以存其他键
 * def 默认返回值
 */
export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}
