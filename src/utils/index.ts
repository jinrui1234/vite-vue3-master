// 防抖函数
export function debounce(fn: any, delay = 300) {
  let timer: any = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}
