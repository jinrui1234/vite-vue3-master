import { onMounted, onUnmounted } from 'vue'
import { Watermark } from 'watermark-lite'
import useUserStore from '@/store/user'
import { formatDateTime } from './util'

const userStore = useUserStore()
const wm = new Watermark()

export function watermark(id: string) {
  onMounted(() => {
    const time = formatDateTime(new Date())
    wm.mount({
      el: id,
      text: `舆情科学研判平台${userStore.userInfo?.name}${time}`,
      rows: 3,
      cols: 5,
      rotate: 20,
      opacity: 0.05,
    })
  })

  onUnmounted(() => {
    wm.unmount()
  })

  return {}
}
