let lockCount = 0

export function lockBodyScroll() {
  lockCount++
  document.body.style.overflow = "hidden"
}

export function unlockBodyScroll() {
  lockCount--
  if (lockCount <= 0) {
    lockCount = 0
    document.body.style.overflow = ""
  }
}