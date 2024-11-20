self.onmessage = async () => {
  await pauseTime()
  self.postMessage({})
}

const pauseTime = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 25)
  })
}
