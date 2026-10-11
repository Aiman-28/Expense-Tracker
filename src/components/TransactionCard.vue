<script>
import AppIcon from '@/components/AppIcon.vue'
import { TYPE_INCOME, getCategoryMeta } from '@/utils/constants'
import { formatCurrency, formatDate } from '@/utils/format'

export default {
  name: 'TransactionCard',
  components: { AppIcon },

  props: {
    transaction: { type: Object, required: true },
    showActions: { type: Boolean, default: true },
  },

  emits: ['edit', 'delete'],

  computed: {
    meta() {
      return getCategoryMeta(this.transaction.category)
    },
    isIncome() {
      return this.transaction.type === TYPE_INCOME
    },
  },

  methods: {
    formatCurrency,
    formatDate,
  },
}
</script>

<template>
  <article class="tx">
    <RouterLink class="tx__main" :to="{ name: 'details', params: { id: transaction.id } }">
      <span class="tx__mark" :style="{ background: `linear-gradient(135deg, ${meta.color}40, ${meta.color}12)`, color: meta.color }" aria-hidden="true">
        <AppIcon :name="meta.icon" :size="22" />
      </span>
      <span class="tx__info">
        <span class="tx__title">{{ transaction.description }}</span>
        <span class="tx__sub">
          <span class="chip">{{ transaction.category }}</span>
          <span class="tx__date">{{ formatDate(transaction.date) }}</span>
        </span>
      </span>
      <span class="tx__amount num" :class="isIncome ? 'is-income' : 'is-expense'">
        {{ isIncome ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
      </span>
    </RouterLink>

    <div v-if="showActions" class="tx__actions">
      <button class="btn-icon" type="button" :aria-label="`Edit ${transaction.description}`" @click="$emit('edit', transaction)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      </button>
      <button class="btn-icon btn-icon--danger" type="button" :aria-label="`Delete ${transaction.description}`" @click="$emit('delete', transaction)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
        </svg>
      </button>
    </div>
  </article>
</template>

<style scoped>
.tx {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem 0.35rem 0.35rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  /* opacity + transform are listed so the list enter/leave/move transitions keep working. */
  transition: border-color 0.15s, box-shadow 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
}

.tx:hover {
  border-color: var(--text-3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tx:hover .tx__mark {
  transform: scale(1.08) rotate(-5deg);
}

.tx__main {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.9rem;
  min-width: 0;
  padding: 0.5rem 0.5rem 0.5rem 0.55rem;
  border-radius: 12px;
}

.tx__mark {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tx__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.tx__title {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tx__sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.2rem 0.6rem;
}

.tx__date {
  font-size: 0.82rem;
  color: var(--text-3);
}

.tx__amount {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
}

.tx__amount.is-income {
  color: var(--income);
}

.tx__amount.is-expense {
  color: var(--expense);
}

.tx__actions {
  display: flex;
  gap: 0.35rem;
  padding-left: 0.4rem;
  border-left: 1px solid var(--border);
}

@media (max-width: 560px) {
  .tx {
    padding-right: 0.5rem;
  }

  .tx__main {
    gap: 0.65rem;
    padding-right: 0.25rem;
  }

  .tx__mark {
    width: 38px;
    height: 38px;
  }

  .tx__amount {
    font-size: 0.95rem;
  }

  /* Let long descriptions wrap onto a second line instead of being cut off. */
  .tx__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow-wrap: anywhere;
    line-height: 1.25;
  }

  .tx__actions {
    flex-direction: column;
    padding-left: 0.4rem;
  }

  .tx__actions .btn-icon {
    width: 30px;
    height: 30px;
  }
}
</style>
