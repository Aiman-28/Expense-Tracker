<script>
import CustomSelect from '@/components/CustomSelect.vue'
import { SORT_OPTIONS, TYPES, getCategoryMeta } from '@/utils/constants'

export default {
  name: 'FilterBar',
  components: { CustomSelect },

  props: {
    type: { type: String, default: 'All' },
    category: { type: String, default: 'All' },
    sort: { type: String, default: 'date-desc' },
    categories: { type: Array, default: () => [] },
    hasActiveFilters: { type: Boolean, default: false },
  },

  emits: ['update:type', 'update:category', 'update:sort', 'reset'],

  data() {
    return {
      sortOptions: SORT_OPTIONS,
    }
  },

  computed: {
    typeOptions() {
      return ['All', ...TYPES]
    },
    categoryOptions() {
      return [
        { value: 'All', label: 'All categories', icon: 'list' },
        ...this.categories.map((item) => ({ value: item, label: item, icon: getCategoryMeta(item).icon })),
      ]
    },
    sortChoices() {
      return this.sortOptions.map((option) => ({ ...option, icon: 'barChart' }))
    },
  },
}
</script>

<template>
  <div class="filters">
    <div class="segmented" role="group" aria-label="Filter by type">
      <button
        v-for="option in typeOptions"
        :key="option"
        type="button"
        class="segmented__btn"
        :class="{ 'is-active': type === option }"
        :aria-pressed="type === option"
        @click="$emit('update:type', option)"
      >
        {{ option }}
      </button>
    </div>

    <CustomSelect
      class="select"
      label="Filter by category"
      :model-value="category"
      :options="categoryOptions"
      @update:model-value="$emit('update:category', $event)"
    />

    <CustomSelect
      class="select"
      label="Sort transactions"
      :model-value="sort"
      :options="sortChoices"
      @update:model-value="$emit('update:sort', $event)"
    />

    <button v-if="hasActiveFilters" class="btn-link" type="button" @click="$emit('reset')">Clear filters</button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.segmented {
  display: inline-flex;
  padding: 3px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--surface);
}

.segmented__btn {
  padding: 0.45rem 0.95rem;
  border: 0;
  border-radius: 7px;
  background: transparent;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-2);
  cursor: pointer;
  transition: background 0.25s, color 0.2s, transform 0.15s ease, box-shadow 0.25s;
}

.segmented__btn:hover {
  color: var(--text);
  background: linear-gradient(135deg, var(--grad-soft-a), var(--grad-soft-b));
}

.segmented__btn:active {
  transform: scale(0.95);
}

.segmented__btn.is-active {
  background: var(--grad-brand);
  color: var(--grad-text);
  box-shadow: 0 6px 14px -8px var(--grad-a);
}

.select {
  min-width: 170px;
}

@media (max-width: 560px) {
  .segmented {
    width: 100%;
  }

  .segmented__btn {
    flex: 1;
  }

  .select {
    flex: 1;
    min-width: 140px;
  }
}
</style>
