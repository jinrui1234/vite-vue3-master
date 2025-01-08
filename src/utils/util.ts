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

export function formatDateTime(obj: any, type = true) {
  if (obj == null) {
    return null
  }
  const date = new Date(obj)
  const y = date.getFullYear()
  const m = '0' + (date.getMonth() + 1)
  const d = '0' + date.getDate()
  return !!type
    ? y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    : y + '年' + m.substring(m.length - 2, m.length) + '月' + d.substring(d.length - 2, d.length) + '日'
}

export function formatData(time: any, mode?: string) {
  if (time) {
    const now = new Date(time)
    // const year = now.getFullYear();
    // const month = (now.getMonth() + 1).toString();
    const date = now.getDate().toString()
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')
    const ss = now.getSeconds().toString().padStart(2, '0')
    if (mode === 'day') {
      return `${date}日${hh}:${mm}:${ss}`
    } else if (mode === 'hour') {
      return `${hh}:${mm}:${ss}`
    }
  }
}

export function getDateBetween(start: any, end: any) {
  const result = []
  //使用传入参数的时间
  const startTime = new Date(start)
  const endTime = new Date(end)
  while (endTime - startTime >= 0) {
    const year = startTime.getFullYear()
    let month = startTime.getMonth()
    month = month < 9 ? '0' + (month + 1) : month + 1
    const day = startTime.getDate().toString().length == 1 ? '0' + startTime.getDate() : startTime.getDate()
    //加入数组
    result.push(year + '-' + month + '-' + day)
    //更新日期
    startTime.setDate(startTime.getDate() + 1)
  }
  return result
}

export function bigNumberTransform(value: number, type = false, bit = 1) {
  const newValue = ['', '', '']
  let fr = 1000
  let num = 3
  let text1 = ''
  let text2 = ''
  let fm = 1
  if (value == '' || value == null || isNaN(value)) {
    return !type ? newValue : ''
  }
  if (value < 0) {
    value = Math.abs(value)
    text2 = '-'
  }
  while (value / fr >= 1) {
    fr *= 10
    num += 1
    // console.log('数字', value / fr, 'num:', num)
  }
  if (num <= 4) {
    // 千
    newValue[0] = value
    newValue[1] = ''
  } else if (num <= 8) {
    // 万
    // text1 = parseInt(num - 4) / 3 > 1 ? '千万' : '万'
    text1 = '万'
    // tslint:disable-next-line:no-shadowed-variable
    fm = text1 === '万' ? 10000 : 10000000
    if (value % fm === 0) {
      newValue[0] = parseInt(value / fm) + ''
    } else {
      newValue[0] = parseFloat(value / fm).toFixed(bit) + ''
    }
    newValue[1] = text1
  } else {
    // 亿 if (num <= 16)
    // text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
    text1 = '亿'
    text1 = (num - 8) / 4 > 1 ? '万亿' : text1
    text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
    text1 = (num - 8) / 10 > 1 ? '亿亿' : text1
    // tslint:disable-next-line:no-shadowed-variable
    fm = 1
    if (text1 === '亿') {
      fm = 100000000
    } else if (text1 === '千亿') {
      fm = 100000000000
    } else if (text1 === '万亿') {
      fm = 1000000000000
    } else if (text1 === '千万亿') {
      fm = 1000000000000000
    } else {
      fm = 1000000000000000000
    }
    if (value % fm === 0) {
      newValue[0] = parseInt(value / fm) + ''
    } else {
      newValue[0] = parseFloat(value / fm).toFixed(bit) + ''
    }
    newValue[1] = text1
  }
  if (value < 1000) {
    // 千以下
    newValue[0] = value + ''
    newValue[1] = ''
  }
  newValue[0] = text2 ? text2 + newValue[0] : newValue[0]
  return !type ? newValue : newValue[0] + `${newValue[1]}`
}

// 删除文案HTML标签
export const removeHTMLTags = (str: string) => {
  return str?.replace(/<[^>]*>/g, '')?.replace(/&nbsp;/g, '') || ''
}

// 分钟转化为小时
export const minTransformHour = (time: number | string) => {
  return (parseInt(time) / 60).toFixed(1)
}

// 判断是否存在
export const isExistence = (prop: any) => {
  return prop !== undefined
}

// 获取host
export const getHost = () => {
  return window.location.href?.split('#')?.[0] || ''
}

// 判断是否是链接
export const isLink = (str: string) => {
  const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/
  return pattern.test(str)
}

// 判断是否为移动端
export const isMobile = () => {
  const userAgentInfo = navigator.userAgent
  const mobileAgents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  const mobileFlag = mobileAgents.some((mobileAgent) => {
    return userAgentInfo.indexOf(mobileAgent) > 0
  })
  return mobileFlag
}
