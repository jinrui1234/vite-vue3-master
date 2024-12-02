const storage = window?.localStorage

/**
 * @description 存储方法
 * @param {String} key 键名
 * @param {any} value 值
 * @param {number} [expires] 可选，默认0，永久
 */
export const setStorage = (key: string, value: any, expires: number = 0) => {
  const storeValue = {
    value,
    startTime: new Date().getTime(),
    __expires__: expires,
  }
  storage.setItem(key, JSON.stringify(storeValue))
}

export const getStorage = (key: string) => {
  try {
    const storeItem = storage.getItem(key)
    if (!storeItem) return null

    const storeValue = JSON.parse(storeItem)
    const time = new Date().getTime()

    // 如果是永久，则直接返回
    if (storeValue?.__expires__ === 0) return storeValue.value

    // 判断当前时间是否过期
    if (storeValue?.startTime && time - storeValue?.startTime >= storeValue?.__expires__) {
      removeStorage(key)
      return null
    }

    return storeValue.value
  } catch (error) {
    return null
  }
}

/**
 * @description 删除方法
 * @param {String} key 删除键名
 */
export const removeStorage = (key: string) => {
  key && storage.removeItem(key)
}

/**
 * @description 清除所有本地存储
 */
export const clearStorage = () => {
  storage.clear()
}
