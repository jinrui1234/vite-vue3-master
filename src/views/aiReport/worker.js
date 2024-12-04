let _self = self
_self.onmessage = () => {
  setTimeout(() => {
    _self.postMessage({})
  }, 25)
}
