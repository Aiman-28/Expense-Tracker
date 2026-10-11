<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import FilterBar from '@/components/FilterBar.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import SearchBar from '@/components/SearchBar.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import { showToast } from '@/store/toastStore'
import { actions, getters } from '@/store/transactionStore'
import { ALL_CATEGORIES, SORT_OPTIONS, TYPE_EXPENSE, TYPE_INCOME } from '@/utils/constants'
import { formatCurrency } from '@/utils/format'

export default {
  name: 'TransactionsView',
  components: { ConfirmDialog, EmptyState, FilterBar, ModalDialog, SearchBar, TransactionCard, TransactionForm },

  data() {
    return {
      allCategories: ALL_CATEGORIES,

      // Search, filter and sort state
      search: '',
      typeFilter: 'All',
      categoryFilter: 'All',
      sort: 'date-desc',

      // Add / edit dialog
      formOpen: false,
      editing: null,

      // Delete confirmation
      pendingDelete: null,
    }
  },

  computed: {
    transactions() {
      return getters.all()
    },

    count() {
      return getters.count()
    },

    hasActiveFilters() {
      return this.search.trim() !== '' || this.typeFilter !== 'All' || this.categoryFilter !== 'All'
    },

    filtered() {
      const query = this.search.trim().toLowerCase()
      const list = this.transactions.filter((t) => {
        const matchesSearch =
          !query || t.description.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)
        const matchesType = this.typeFilter === 'All' || t.type === this.typeFilter
        const matchesCategory = this.categoryFilter === 'All' || t.category === this.categoryFilter
        return matchesSearch && matchesType && matchesCategory
      })

      const byDate = (a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt
      switch (this.sort) {
        case 'date-asc':
          return list.sort(byDate)
        case 'amount-desc':
          return list.sort((a, b) => b.amount - a.amount)
        case 'amount-asc':
          return list.sort((a, b) => a.amount - b.amount)
        default:
          return list.sort((a, b) => byDate(b, a))
      }
    },

    filteredIncome() {
      return this.filtered.filter((t) => t.type === TYPE_INCOME).reduce((sum, t) => sum + t.amount, 0)
    },

    filteredExpenses() {
      return this.filtered.filter((t) => t.type === TYPE_EXPENSE).reduce((sum, t) => sum + t.amount, 0)
    },

    deleteMessage() {
      if (!this.pendingDelete) return ''
      return `“${this.pendingDelete.description}” will be removed permanently. This cannot be undone.`
    },
  },

  // The dashboard's stat cards link here with ?type=, ?category= and ?sort= to open a pre-filtered list.
  // Every value is checked first, so a hand-edited URL can never put the page in an invalid state.
  created() {
    const { type, category, sort } = this.$route.query
    if ([TYPE_INCOME, TYPE_EXPENSE].includes(type)) this.typeFilter = type
    if (ALL_CATEGORIES.includes(category)) this.categoryFilter = category
    if (SORT_OPTIONS.some((option) => option.value === sort)) this.sort = sort
  },

  // The dashboard's "Add transaction" button links here with ?new=1 to open the form straight away.
  mounted() {
    if (this.$route.query.new) {
      this.openCreate()
      this.$router.replace({ name: 'transactions' })
    }
  },

  methods: {
    formatCurrency,

    resetFilters() {
      this.search = ''
      this.typeFilter = 'All'
      this.categoryFilter = 'All'
    },

    openCreate() {
      this.editing = null
      this.formOpen = true
    },

    openEdit(transaction) {
      this.editing = transaction
      this.formOpen = true
    },

    closeForm() {
      this.formOpen = false
    },

    handleSave(data) {
      if (this.editing) {
        actions.update(this.editing.id, data)
        showToast('Transaction updated.')
      } else {
        actions.add(data)
        showToast('Transaction added.')
      }
      this.closeForm()
    },

    requestDelete(transaction) {
      this.pendingDelete = transaction
    },

    confirmDelete() {
      if (this.pendingDelete) {
        actions.remove(this.pendingDelete.id)
        showToast('Transaction deleted.')
      }
      this.pendingDelete = null
    },

    loadSamples() {
      actions.resetToSampleData()
      showToast('Sample transactions loaded.')
    },
  },
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Transactions</h1>
        <p>{{ count }} in total. Search, filter and sort to find what you need.</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add transaction
      </button>
    </div>

    <EmptyState
      v-if="count === 0"
      title="No transactions yet"
      message="Record your first income or expense to start tracking your money."
    >
      <button class="btn btn-primary" type="button" @click="openCreate">Add transaction</button>
      <button class="btn btn-ghost" type="button" @click="loadSamples">Load sample data</button>
    </EmptyState>

    <template v-else>
      <div class="toolbar">
        <SearchBar v-model="search" placeholder="Search by description or category" />
        <FilterBar
          v-model:type="typeFilter"
          v-model:category="categoryFilter"
          v-model:sort="sort"
          :categories="allCategories"
          :has-active-filters="hasActiveFilters"
          @reset="resetFilters"
        />
      </div>

      <p class="summary" aria-live="polite">
        Showing {{ filtered.length }} of {{ count }}
        <template v-if="filtered.length">
          <span class="summary__item is-income num">Income {{ formatCurrency(filteredIncome) }}</span>
          <span class="summary__item is-expense num">Expenses {{ formatCurrency(filteredExpenses) }}</span>
        </template>
      </p>

      <EmptyState
        v-if="filtered.length === 0"
        title="Nothing matches those filters"
        message="Try a different search word, or clear the filters to see every transaction."
      >
        <button class="btn btn-ghost" type="button" @click="resetFilters">Clear filters</button>
      </EmptyState>

      <TransitionGroup v-else name="list" tag="div" class="list">
        <TransactionCard
          v-for="item in filtered"
          :key="item.id"
          :transaction="item"
          @edit="openEdit"
          @delete="requestDelete"
        />
      </TransitionGroup>
    </template>

    <ModalDialog :open="formOpen" :title="editing ? 'Edit transaction' : 'Add transaction'" @close="closeForm">
      <TransactionForm :transaction="editing" @submit="handleSave" @cancel="closeForm" />
    </ModalDialog>

    <ConfirmDialog
      :open="pendingDelete !== null"
      :message="deleteMessage"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1rem;
  margin: 1.1rem 0 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-2);
}

.summary__item.is-income {
  color: var(--income);
}

.summary__item.is-expense {
  color: var(--expense);
}

.list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.list-move {
  transition: transform 0.2s ease;
}
</style>
