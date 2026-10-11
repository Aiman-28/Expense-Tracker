<script>
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { formatCurrency } from '@/utils/format'

export default {
  name: 'StatCard',
  components: { AppIcon, RouterLink },

  props: {
    label: { type: String, required: true },
    // A number (formatted by `format`) or plain text such as a category name.
    value: { type: [Number, String], default: 0 },
    format: { type: String, default: 'currency' }, // 'currency' | 'count' | 'text'
    tone: { type: String, default: 'neutral' },
    hint: { type: String, default: '' },
    // Optional icon name from utils/icons.js, shown in a tinted badge.
    icon: { type: String, default: '' },
    // Optional route location. When set, the whole card becomes a link to that page.
    to: { type: Object, default: null },
  },

  computed: {
    formatted() {
      if (this.format === 'text') return this.value
      return this.format === 'currency' ? formatCurrency(this.value) : this.value.toLocaleString('en-US')
    },
  },
}
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'article'"
    :to="to || undefined"
    class="stat"
    :class="[`stat--${tone}`, { 'stat--link': to }]"
  >
    <span v-if="icon" class="stat__icon" aria-hidden="true"><AppIcon :name="icon" :size="20" /></span>
    <p class="stat__label">{{ label }}</p>
    <p class="stat__value" :class="{ num: format !== 'text' }">{{ formatted }}</p>
    <p v-if="hint" class="stat__hint">{{ hint }}</p>
  </component>
</template>

<style scoped>
.stat {
  position: relative;
  padding: 1.15rem 1.25rem 1.15rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  /* Cards rise into place one after another; --i is set by the parent for the stagger. */
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 70ms);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.15s;
}

.stat:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--text-3);
}

/* When the card is a link (it has a destination), reset the default link look. */
a.stat--link {
  display: block;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

a.stat--link:focus-visible {
  outline: 2px solid var(--grad-b);
  outline-offset: 3px;
}

.stat__icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--grad-brand);
  color: var(--grad-text);
  box-shadow: 0 8px 16px -10px var(--grad-a);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat:hover .stat__icon {
  transform: scale(1.1) rotate(-6deg);
}

.stat--income .stat__icon {
  background: linear-gradient(135deg, #0e8a5f, #3dd598);
  color: #fff;
}

.stat--expense .stat__icon {
  background: linear-gradient(135deg, #d93f46, #ff8a6b);
  color: #fff;
}

/* A thin coloured edge tells income, expenses and neutral figures apart at a glance. */
.stat::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: linear-gradient(180deg, var(--grad-a), var(--grad-b));
}

.stat--income::before {
  background: linear-gradient(180deg, #0e8a5f, #3dd598);
}

.stat--expense::before {
  background: linear-gradient(180deg, #d93f46, #ff8a6b);
}

.stat__label {
  padding-right: 2.9rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-2);
}

.stat__value {
  margin-top: 0.25rem;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.stat--income .stat__value {
  color: var(--income);
}

.stat--expense .stat__value {
  color: var(--expense);
}

.stat__hint {
  margin-top: 0.35rem;
  font-size: 0.82rem;
  color: var(--text-3);
}
</style>
