import { ElMessage } from 'element-plus'
// import { Message } from "@/utils/message";

export function Message(type: string, info: string, param?: object) {
  const config = {
    duration: 1500,
    offset: 70,
    ...param,
  }
  if (type === 'success') {
    ElMessage({
      type: 'success',
      message: info,
      ...config,
    })
  } else if (type === 'error') {
    ElMessage({
      type: 'error',
      message: info,
      ...config,
    })
  } else if (type === 'info') {
    ElMessage({
      type: 'info',
      message: info,
      ...config,
    })
  } else if (type === 'warning') {
    ElMessage({
      type: 'warning',
      message: info,
      ...config,
    })
  }
}
