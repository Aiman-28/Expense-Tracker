<script>
import DashboardStats from '@/components/DashboardStats.vue'
import DonutChart from '@/components/DonutChart.vue'
import EmptyState from '@/components/EmptyState.vue'
import MonthlyChart from '@/components/MonthlyChart.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import { showToast } from '@/store/toastStore'
import { actions, getters } from '@/store/transactionStore'

export default {
  name: 'DashboardView',
  components: { DashboardStats, DonutChart, EmptyState, MonthlyChart, TransactionCard },

  computed: {
    count() {
      return getters.count()
    },

    // Every figure on the dashboard is calculated from the saved transactions.
    stats() {
      return {
        income: getters.totalIncome(),
        expenses: getters.totalExpenses(),
        balance: getters.balance(),
        count: getters.count(),
        averageExpense: getters.averageExpense(),
        topCategory: getters.topExpenseCategory(),
        topCategoryAmount: getters.expensesByCategory()[0]?.value ?? 0,
        monthIncome: getters.thisMonth().income,
        monthExpense: getters.thisMonth().expense,
        trend: getters.balanceTrend(),
      }
    },

    monthlySummary() {
      return getters.monthlySummary()
    },

    expenseBreakdown() {
      return getters.expenseBreakdown()
    },

    recent() {
      return getters.sortedByDate().slice(0, 5)
    },

    greeting() {
      const hour = new Date().getHours()
      if (hour < 12) return 'Good morning'
      if (hour < 18) return 'Good afternoon'
      return 'Good evening'
    },
  },

  methods: {
    goToAdd() {
      this.$router.push({ name: 'transactions', query: { new: '1' } })
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
        <h1>{{ greeting }}</h1>
        <p>Here is where your money stands today.</p>
      </div>
      <button class="btn btn-primary" type="button" @click="goToAdd">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add transaction
      </button>
    </div>

    <EmptyState
      v-if="count === 0"
      title="No transactions yet"
      message="Add your first income or expense, or load sample data to explore the dashboard, charts and filters right away."
    >
      <button class="btn btn-primary" type="button" @click="goToAdd">Add transaction</button>
      <button class="btn btn-ghost" type="button" @click="loadSamples">Load sample data</button>
    </EmptyState>

    <template v-else>
      <DashboardStats :stats="stats" />

      <div class="grid">
        <section class="card">
          <div class="card__head">
            <h2 class="card__title">Last six months</h2>
          </div>
          <MonthlyChart :data="monthlySummary" />
        </section>

        <section class="card">
          <div class="card__head">
            <h2 class="card__title">Where your money goes</h2>
          </div>
          <DonutChart :segments="expenseBreakdown" />
        </section>
      </div>

      <section class="recent">
        <div class="card__head">
          <h2 class="card__title">Recent transactions</h2>
          <RouterLink class="btn-link" :to="{ name: 'transactions' }">See all transactions</RouterLink>
        </div>
        <div class="recent__list">
          <TransactionCard v-for="item in recent" :key="item.id" :transaction="item" :show-actions="false" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.recent {
  margin-top: 2rem;
}

.recent__list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
