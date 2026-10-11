<script>
import AppIcon from '@/components/AppIcon.vue'

let uid = 0

export default {
  name: 'CustomSelect',
  components: { AppIcon },

  props: {
    modelValue: { type: String, default: '' },
    // [{ value, label, icon? }]
    options: { type: Array, required: true },
    label: { type: String, required: true }, // accessible name
  },

  emits: ['update:modelValue'],

  data() {
    return {
      open: false,
      openUp: false,
      maxHeight: 280,
      activeIndex: -1,
      id: `cs-${++uid}`,
    }
  },

  computed: {
    selectedIndex() {
      return this.options.findIndex((option) => option.value === this.modelValue)
    },
    selected() {
      return this.options[this.selectedIndex] ?? this.options[0]
    },
    // The first option is the "no filter" state; anything else gets the filled gradient look.
    isChanged() {
      return this.selectedIndex > 0
    },
  },

  beforeUnmount() {
    this.removeListeners()
  },

  methods: {
    toggle() {
      this.open ? this.close() : this.openMenu()
    },

    openMenu() {
      this.placeMenu()
      this.activeIndex = Math.max(this.selectedIndex, 0)
      this.open = true
      document.addEventListener('pointerdown', this.onOutside)
      window.addEventListener('resize', this.close)
      this.$nextTick(this.scrollToActive)
    },

    close() {
      this.open = false
      this.removeListeners()
    },

    removeListeners() {
      document.removeEventListener('pointerdown', this.onOutside)
      window.removeEventListener('resize', this.close)
    },

    onOutside(event) {
      if (!this.$el.contains(event.target)) this.close()
    },

    // Open downward by default. Flip up only when there is clearly more room above.
    placeMenu() {
      const rect = this.$refs.trigger.getBoundingClientRect()
      const reserve = 96 // keeps the menu clear of the mobile tab bar
      const below = window.innerHeight - rect.bottom - reserve
      const above = rect.top - 16
      this.openUp = below < 170 && above > below
      this.maxHeight = Math.max(140, Math.min(280, this.openUp ? above : below))
    },

    choose(option) {
      this.$emit('update:modelValue', option.value)
      this.close()
      this.$refs.trigger.focus()
    },

    move(step) {
      const last = this.options.length - 1
      this.activeIndex = Math.min(last, Math.max(0, this.activeIndex + step))
      this.scrollToActive()
    },

    scrollToActive() {
      this.$refs.list?.children[this.activeIndex]?.scrollIntoView({ block: 'nearest' })
    },

    onKeydown(event) {
      const { key } = event
      if (!this.open) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
          event.preventDefault()
          this.openMenu()
        }
        return
      }
      if (key === 'Escape') {
        event.preventDefault()
        this.close()
      } else if (key === 'ArrowDown') {
        event.preventDefault()
        this.move(1)
      } else if (key === 'ArrowUp') {
        event.preventDefault()
        this.move(-1)
      } else if (key === 'Home') {
        event.preventDefault()
        this.activeIndex = 0
        this.scrollToActive()
      } else if (key === 'End') {
        event.preventDefault()
        this.activeIndex = this.options.length - 1
        this.scrollToActive()
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault()
        this.choose(this.options[this.activeIndex])
      } else if (key === 'Tab') {
        this.close()
      }
    },
  },
}
</script>

<template>
  <div class="cs" :class="{ 'is-open': open, 'is-changed': isChanged }">
    <button
      ref="trigger"
      class="cs__trigger"
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="`${label}: ${selected?.label}`"
      :aria-controls="`${id}-list`"
      :aria-activedescendant="open && activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined"
      @click="toggle"
      @keydown="onKeydown"
    >
      <AppIcon v-if="selected?.icon" class="cs__lead" :name="selected.icon" :size="18" />
      <span class="cs__value">{{ selected?.label }}</span>
      <svg class="cs__chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 8l5 5 5-5" />
      </svg>
    </button>

    <Transition name="cs-menu">
      <ul
        v-show="open"
        :id="`${id}-list`"
        ref="list"
        class="cs__menu"
        :class="{ 'is-up': openUp }"
        :style="{ maxHeight: `${maxHeight}px` }"
        role="listbox"
        :aria-label="label"
        tabindex="-1"
      >
        <li
          v-for="(option, index) in options"
          :id="`${id}-opt-${index}`"
          :key="option.value"
          class="cs__option"
          :class="{ 'is-selected': option.value === modelValue, 'is-active': index === activeIndex }"
          role="option"
          :aria-selected="option.value === modelValue"
          @pointerenter="activeIndex = index"
          @click="choose(option)"
        >
          <span v-if="option.icon" class="cs__icon"><AppIcon :name="option.icon" :size="16" /></span>
          <span class="cs__text">{{ option.label }}</span>
          <svg v-if="option.value === modelValue" class="cs__check" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 10.5l4 4 8-9" />
          </svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.cs {
  position: relative;
}

/* Gradient outline: a white fill on the padding box, the gradient behind the border box. */
.cs__trigger {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.7rem 0.85rem;
  border: 1.5px solid transparent;
  border-radius: var(--r-sm);
  background:
    linear-gradient(var(--surface), var(--surface)) padding-box,
    linear-gradient(135deg, var(--grad-a), var(--grad-b)) border-box;
  color: var(--text);
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.15s ease, color 0.2s ease;
}

.cs__trigger:hover {
  box-shadow: 0 8px 20px -12px var(--grad-a);
}

.cs__trigger:active {
  transform: scale(0.98);
}

.cs__trigger:focus-visible,
.cs.is-open .cs__trigger {
  outline: none;
  box-shadow: 0 0 0 4px var(--ring);
}

/* Once a filter is applied, the whole control fills with the gradient. */
.cs.is-changed .cs__trigger {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b)) border-box;
  color: var(--grad-text);
}

.cs__lead {
  flex-shrink: 0;
}

.cs__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs__chevron {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  opacity: 0.75;
  transition: transform 0.25s ease;
}

.cs.is-open .cs__chevron {
  transform: rotate(180deg);
}

.cs__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 40;
  min-width: 100%;
  width: max-content;
  max-width: min(320px, 90vw);
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  list-style: none;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: 0 24px 48px -20px rgba(10, 30, 24, 0.45);
  transform-origin: top center;
  scrollbar-width: thin;
}

.cs__menu.is-up {
  top: auto;
  bottom: calc(100% + 8px);
  transform-origin: bottom center;
}

/* A slim gradient bar across the top edge ties the menu to the trigger. */
.cs__menu::before {
  content: '';
  position: sticky;
  top: -6px;
  display: block;
  height: 3px;
  margin: -6px -6px 6px;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(90deg, var(--grad-a), var(--grad-b));
}

.cs__option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  border-radius: 9px;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease, transform 0.12s ease;
}

.cs__option.is-active {
  background: linear-gradient(135deg, var(--grad-soft-a), var(--grad-soft-b));
  transform: translateX(2px);
}

.cs__option.is-selected {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  color: var(--grad-text);
  font-weight: 700;
}

.cs__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-2);
}

.cs__option.is-selected .cs__icon {
  background: rgba(255, 255, 255, 0.22);
  color: inherit;
}

.cs__text {
  flex: 1;
  min-width: 0;
}

.cs__check {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

.cs-menu-enter-active,
.cs-menu-leave-active {
  transition: opacity 0.16s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.cs-menu-enter-from,
.cs-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.cs__menu.is-up.cs-menu-enter-from,
.cs__menu.is-up.cs-menu-leave-to {
  transform: translateY(6px) scale(0.97);
}
</style>
