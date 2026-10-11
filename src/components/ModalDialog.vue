<script>
export default {
  name: 'ModalDialog',

  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    size: { type: String, default: 'md' },
  },

  emits: ['close'],

  data() {
    return { previouslyFocused: null }
  },

  watch: {
    // Stop the page behind the dialog from scrolling while it is open, and manage keyboard focus:
    // remember what had focus, move focus into the dialog, and give it back when the dialog closes.
    async open(isOpen) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
      if (isOpen) {
        this.previouslyFocused = document.activeElement
        await this.$nextTick()
        const modal = document.querySelector('.modal[aria-modal="true"]')
        if (modal && !modal.contains(document.activeElement)) (this.focusable(modal)[0] ?? modal).focus()
      } else if (this.previouslyFocused?.isConnected) {
        this.previouslyFocused.focus()
        this.previouslyFocused = null
      }
    },
  },

  mounted() {
    document.addEventListener('keydown', this.onKeydown)
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
    document.body.style.overflow = ''
  },

  methods: {
    focusable(root) {
      return [...root.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.disabled && el.offsetParent !== null,
      )
    },

    onKeydown(event) {
      if (!this.open) return
      if (event.key === 'Escape') {
        this.$emit('close')
        return
      }
      // Keep Tab / Shift+Tab cycling inside the dialog.
      if (event.key === 'Tab') {
        const modal = document.querySelector('.modal[aria-modal="true"]')
        if (!modal) return
        const items = this.focusable(modal)
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
          event.preventDefault()
          first.focus()
        }
      }
    },
  },
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="backdrop" @mousedown.self="$emit('close')">
        <div class="modal" :class="`modal--${size}`" role="dialog" tabindex="-1" aria-modal="true" :aria-label="title">
          <header class="modal__header">
            <h2 class="modal__title">{{ title }}</h2>
            <button class="btn-icon" type="button" aria-label="Close dialog" @click="$emit('close')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>
          <div class="modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--overlay);
}

.modal {
  outline: none;
  width: 100%;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
}

.modal--md {
  max-width: 520px;
}

.modal--sm {
  max-width: 400px;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0;
}

.modal__title {
  font-size: 1.3rem;
  font-weight: 700;
}

.modal__body {
  padding: 1.25rem 1.5rem 1.5rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(14px) scale(0.98);
}

@media (max-width: 560px) {
  .backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .modal {
    max-width: none;
    max-height: 92vh;
    border-radius: var(--r-lg) var(--r-lg) 0 0;
  }
}
</style>
