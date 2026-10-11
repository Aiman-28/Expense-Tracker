<script>
export default {
  name: 'EmptyState',

  props: {
    title: { type: String, required: true },
    message: { type: String, default: '' },
  },
}
</script>

<template>
  <div class="empty">
    <svg class="empty__art" viewBox="0 0 120 90" fill="none" aria-hidden="true">
      <rect x="14" y="22" width="92" height="56" rx="10" fill="var(--surface-2)" stroke="var(--border)" stroke-width="2" />
      <rect x="24" y="36" width="44" height="6" rx="3" fill="var(--border)" />
      <rect x="24" y="50" width="30" height="6" rx="3" fill="var(--border)" />
      <rect x="24" y="64" width="38" height="6" rx="3" fill="var(--border)" />
      <circle cx="88" cy="28" r="16" fill="var(--saffron)" />
      <path d="M81 28h14M88 21v14" stroke="#1d2a24" stroke-width="3" stroke-linecap="round" />
    </svg>
    <h3 class="empty__title">{{ title }}</h3>
    <p v-if="message" class="empty__message">{{ message }}</p>
    <div v-if="$slots.default" class="empty__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.25rem;
  text-align: center;
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: var(--r-md);
}

.empty__art {
  width: 120px;
  margin-bottom: 1rem;
}

.empty__title {
  font-size: 1.25rem;
}

.empty__message {
  max-width: 380px;
  margin-top: 0.4rem;
  color: var(--text-2);
}

.empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.25rem;
}
</style>
