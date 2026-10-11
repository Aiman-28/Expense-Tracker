<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import { showToast } from '@/store/toastStore'
import { actions, getters } from '@/store/transactionStore'
import AppIcon from '@/components/AppIcon.vue'
import { TYPE_INCOME, getCategoryMeta } from '@/utils/constants'
import { formatCurrency, formatDateTime, formatLongDate } from '@/utils/format'

export default {
  name: 'DetailsView',
  components: { AppIcon, ConfirmDialog, EmptyState, ModalDialog, TransactionForm },

  props: {
    id: { type: String, required: true },
  },

  data() {
    return {
      editOpen: false,
      confirmOpen: false,
    }
  },

  computed: {
    transaction() {
      return actions.getById(this.id)
    },

    isIncome() {
      return this.transaction?.type === TYPE_INCOME
    },

    meta() {
      return getCategoryMeta(this.transaction?.category)
    },

    deleteMessage() {
      if (!this.transaction) return ''
      return `“${this.transaction.description}” will be removed permanently. This cannot be undone.`
    },

    // How this transaction fits into everything in the same category and type.
    categoryStats() {
      if (!this.transaction) return null
      const same = getters
        .all()
        .filter((t) => t.category === this.transaction.category && t.type === this.transaction.type)
      const total = same.reduce((sum, t) => sum + t.amount, 0)
      return {
        count: same.length,
        total,
        share: total ? Math.round((this.transaction.amount / total) * 100) : 0,
      }
    },
  },

  methods: {
    formatCurrency,
    formatDateTime,
    formatLongDate,

    handleSave(data) {
      actions.update(this.id, data)
      this.editOpen = false
      showToast('Transaction updated.')
    },

    async confirmDelete() {
      const id = this.id
      this.confirmOpen = false
      // Leave the page first so it never flashes a "not found" state for the record being deleted.
      await this.$router.push({ name: 'transactions' })
      actions.remove(id)
      showToast('Transaction deleted.')
    },
  },
}
</script>

<template>
  <div>
    <RouterLink class="back" :to="{ name: 'transactions' }">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 6l-6 6 6 6" />
      </svg>
      Back to transactions
    </RouterLink>

    <EmptyState
      v-if="!transaction"
      title="Transaction not found"
      message="It may have been deleted. Head back to the list to pick another one."
    >
      <RouterLink class="btn btn-primary" :to="{ name: 'transactions' }">Go to transactions</RouterLink>
    </EmptyState>

    <template v-else>
      <section class="hero card">
        <span class="hero__mark" :style="{ background: `linear-gradient(135deg, ${meta.color}40, ${meta.color}12)`, color: meta.color }" aria-hidden="true">
          <AppIcon :name="meta.icon" :size="30" />
        </span>
        <div class="hero__text">
          <span class="badge" :class="isIncome ? 'badge--income' : 'badge--expense'">{{ transaction.type }}</span>
          <h1 class="hero__title">{{ transaction.description }}</h1>
        </div>
        <p class="hero__amount num" :class="isIncome ? 'is-income' : 'is-expense'">
          {{ isIncome ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
        </p>
      </section>

      <div class="layout">
        <section class="card">
          <h2 class="card__title">Details</h2>
          <dl class="facts">
            <div class="facts__row">
              <dt>Category</dt>
              <dd>{{ transaction.category }}</dd>
            </div>
            <div class="facts__row">
              <dt>Date</dt>
              <dd>{{ formatLongDate(transaction.date) }}</dd>
            </div>
            <div class="facts__row">
              <dt>Type</dt>
              <dd>{{ transaction.type }}</dd>
            </div>
            <div class="facts__row">
              <dt>Added on</dt>
              <dd>{{ formatDateTime(transaction.createdAt) }}</dd>
            </div>
            <div class="facts__row">
              <dt>Last edited</dt>
              <dd>{{ transaction.updatedAt ? formatDateTime(transaction.updatedAt) : 'Not edited yet' }}</dd>
            </div>
          </dl>
        </section>

        <section class="card">
          <h2 class="card__title">In context</h2>
          <p class="context">
            You have <strong>{{ categoryStats.count }}</strong>
            {{ categoryStats.count === 1 ? 'transaction' : 'transactions' }} in
            <strong>{{ transaction.category }}</strong>, adding up to
            <strong class="num">{{ formatCurrency(categoryStats.total) }}</strong>.
          </p>
          <div class="share" role="img" :aria-label="`This transaction is ${categoryStats.share}% of the category total`">
            <div class="share__bar">
              <div class="share__fill" :class="isIncome ? 'is-income' : 'is-expense'" :style="{ width: categoryStats.share + '%' }"></div>
            </div>
            <p class="share__label">This one makes up {{ categoryStats.share }}% of that total.</p>
          </div>

          <div class="actions">
            <button class="btn btn-primary" type="button" @click="editOpen = true">Edit</button>
            <button class="btn btn-ghost danger" type="button" @click="confirmOpen = true">Delete</button>
          </div>
        </section>
      </div>
    </template>

    <ModalDialog :open="editOpen" title="Edit transaction" @close="editOpen = false">
      <TransactionForm :transaction="transaction ?? null" @submit="handleSave" @cancel="editOpen = false" />
    </ModalDialog>

    <ConfirmDialog
      :open="confirmOpen"
      :message="deleteMessage"
      @confirm="confirmDelete"
      @cancel="confirmOpen = false"
    />
  </div>
</template>

<style scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 1.1rem;
  font-weight: 600;
  color: var(--text-2);
}

.back:hover {
  color: var(--text);
}

.back svg {
  width: 18px;
  height: 18px;
}

.hero {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 1.5rem;
}

.hero__mark {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
}

.hero__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  min-width: 0;
}

.hero__title {
  font-size: clamp(1.35rem, 3vw, 1.9rem);
  overflow-wrap: anywhere;
}

.hero__amount {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: right;
}

.hero__amount.is-income {
  color: var(--income);
}

.hero__amount.is-expense {
  color: var(--expense);
}

.layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.facts {
  margin: 0.9rem 0 0;
}

.facts__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--border);
}

.facts__row:last-child {
  border-bottom: 0;
}

.facts dt {
  color: var(--text-2);
}

.facts dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.context {
  margin-top: 0.9rem;
  color: var(--text-2);
}

.context strong {
  color: var(--text);
}

.share {
  margin-top: 1rem;
}

.share__bar {
  height: 10px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  overflow: hidden;
}

.share__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
}

.share__fill.is-income {
  background: var(--income);
}

.share__fill.is-expense {
  background: var(--expense);
}

.share__label {
  margin-top: 0.5rem;
  font-size: 0.86rem;
  color: var(--text-3);
}

.actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.danger:hover {
  background: var(--expense-soft);
  border-color: var(--expense);
  color: var(--expense);
}

@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .hero {
    flex-wrap: wrap;
  }

  .hero__amount {
    width: 100%;
    text-align: left;
  }

  .actions .btn {
    flex: 1;
  }
}
</style>
