import { reactive } from 'vue'

// Shared list of toast messages. Components read it through a computed property.
export const toasts = reactive([])
let nextId = 1

export function dismissToast(id) {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

export function showToast(message, type = 'success', duration = 3200) {
  const id = nextId++
  toasts.push({ id, message, type })
  setTimeout(() => dismissToast(id), duration)
}
