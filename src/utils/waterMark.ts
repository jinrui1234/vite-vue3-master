import useUserStore from '@/store/user'
import { formatDateTime } from './util'

const userStore = useUserStore()

const id = Symbol('watermark-dom').toString()

export function useWatermark(op = 0.05, appendEl: HTMLElement | null = document.body) {
  // 水印文本
  const markText = `${userStore.userInfo?.name} ${formatDateTime(new Date())}`

  function setWatermark() {
    createWatermark()
    window.addEventListener('resize', resizeClick)
  }

  const createWatermark = () => {
    clear()

    const can = document.createElement('canvas')
    can.width = 300
    can.height = 240

    const cans = can.getContext('2d')
    if (cans) {
      cans.rotate((-20 * Math.PI) / 180)
      cans.font = '14px Vedana'
      cans.fillStyle = `rgba(0, 0, 0, ${op})`
      cans.textAlign = 'left'
      cans.textBaseline = 'middle'
      cans.fillText(markText, can.width / 20, can.height)
    }

    const div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.position = 'absolute'
    div.style.zIndex = '100000000'
    div.style.width = document.documentElement.clientWidth + 'px'
    div.style.height = document.documentElement.clientHeight + 'px'
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'

    const el = appendEl
    el && el.appendChild(div)
    return id
  }

  const clear = () => {
    const domId = document.getElementById(id)
    if (domId) {
      const el = appendEl
      el && el.removeChild(domId)
    }
    window.removeEventListener('resize', resizeClick)
  }

  const resizeClick = () => {
    createWatermark(markText)
  }

  return { setWatermark, clear }
}
