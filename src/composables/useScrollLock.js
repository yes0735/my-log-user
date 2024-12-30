import { ref } from "vue"

export const useScrollLock = () => {
  const isLocked = ref(false)

  const lock = () => {
    if (!isLocked.value) {
      isLocked.value = true
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
    }
  }

  const unlock = () => {
    if (isLocked.value) {
      isLocked.value = false
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }

  return {
    isLocked,
    lock,
    unlock,
  }
}
