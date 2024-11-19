const timeout = 1000 * 60 * 25
// const timeout = 1000 * 60;

self.onmessage = async () => {
  setInterval(() => {
    self.postMessage({})
  }, timeout)
}
