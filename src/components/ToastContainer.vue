<script>
import { toasts, dismissToast } from '@/store/toastStore'

export default {
  name: 'ToastContainer',

  computed: {
    toasts() {
      return toasts
    },
  },

  methods: {
    dismiss(id) {
      dismissToast(id)
    },
  },
}
</script>

<template>
  <div class="region" aria-live="polite">
    <TransitionGroup name="toast" tag="div" class="list">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast--${toast.type}`" role="status">
        <span class="toast__mark" aria-hidden="true">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
            <path d="M12 7v6M12 17h.01" />
          </svg>
        </span>
        <span class="toast__message">{{ toast.message }}</span>
        <button class="toast__close" type="button" aria-label="Dismiss message" @click="dismiss(toast.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.region {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 200;
  pointer-events: none;
}

.list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 240px;
  max-width: 360px;
  padding: 0.75rem 0.85rem;
  border-radius: var(--r-sm);
  background: var(--grad-hero);
  color: #fff;
  box-shadow: var(--shadow-md);
  pointer-events: auto;
}

.toast__mark {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--saffron);
  color: #1d2a24;
}

.toast--error .toast__mark {
  background: var(--expense);
  color: #fff;
}

.toast__mark svg {
  width: 14px;
  height: 14px;
}

.toast__message {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.toast__close {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.toast__close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.toast__close svg {
  width: 14px;
  height: 14px;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

@media (max-width: 720px) {
  .region {
    left: 1rem;
    right: 1rem;
    bottom: 5.5rem;
  }

  .list {
    align-items: stretch;
  }

  .toast {
    max-width: none;
  }
}
</style>
