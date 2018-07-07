/**
 * 解析url参数
 */
export function urlParse () {
  // 利用window.location.search获取到url的参数，类型是字符串。例 "?id=12345&a=b"
  let url = window.location.search
  let obj = {}
  // [?&]表示包含?或者&的字符,
  // [^?&]表示非包含?或者&的字符
  // +表示一个或多个
  // = 表示匹配等号
  // g表示全局匹配
  let reg = /[?&][^?&]+=[^?&]+/g
  // ['?id=12345','&a=b']
  let arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      // 删除第一个字符串，也就是？或者 &，并且用 = 做分割，得到tempArr = ['id'=>12345]
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
