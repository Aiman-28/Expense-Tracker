<script>
export default {
  name: 'SearchBar',

  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Search' },
  },

  emits: ['update:modelValue'],
}
</script>

<template>
  <div class="search">
    <svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
    <input
      class="input search__input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      aria-label="Search transactions"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button v-if="modelValue" class="search__clear" type="button" aria-label="Clear search" @click="$emit('update:modelValue', '')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.search {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.search__icon {
  position: absolute;
  top: 50%;
  left: 0.85rem;
  width: 18px;
  height: 18px;
  color: var(--text-3);
  transform: translateY(-50%);
  pointer-events: none;
}

.search__input {
  padding-left: 2.6rem;
  padding-right: 2.4rem;
}

.search__clear {
  position: absolute;
  top: 50%;
  right: 0.55rem;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--text-2);
  cursor: pointer;
  transform: translateY(-50%);
}

.search__clear:hover {
  background: var(--border);
}

.search__clear svg {
  width: 13px;
  height: 13px;
}
</style>
