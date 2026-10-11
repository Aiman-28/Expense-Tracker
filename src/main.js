import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

createApp(App).use(router).mount('#app')

// Click ripple for every .btn: one delegated listener, the span removes itself afterwards.
document.addEventListener('pointerdown', (event) => {
  const button = event.target instanceof Element ? event.target.closest('.btn') : null
  if (!button || button.disabled) return
  const rect = button.getBoundingClientRect()
  const ripple = document.createElement('span')
  ripple.className = 'ripple'
  ripple.style.left = `${event.clientX - rect.left}px`
  ripple.style.top = `${event.clientY - rect.top}px`
  button.appendChild(ripple)
  setTimeout(() => ripple.remove(), 650)
})
