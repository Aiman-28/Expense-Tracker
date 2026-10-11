<script>
import BalanceHero from './BalanceHero.vue'
import StatCard from './StatCard.vue'
import { formatCurrency } from '@/utils/format'

export default {
  name: 'DashboardStats',
  components: { BalanceHero, StatCard },

  props: {
    stats: { type: Object, required: true },
  },

  methods: {
    formatCurrency,
  },
}
</script>

<template>
  <div class="stats">
    <BalanceHero :balance="stats.balance" :income="stats.income" :expenses="stats.expenses" :trend="stats.trend" />

    <div class="stats__grid">
      <StatCard
        class="span-2"
        label="Total income"
        icon="arrowDown"
        :style="{ '--i': 1 }"
        :value="stats.income"
        tone="income"
        :hint="`This month: ${formatCurrency(stats.monthIncome)}`"
        :to="{ name: 'transactions', query: { type: 'Income' } }"
      />
      <StatCard
        class="span-2"
        label="Total expenses"
        icon="arrowUp"
        :style="{ '--i': 2 }"
        :value="stats.expenses"
        tone="expense"
        :hint="`This month: ${formatCurrency(stats.monthExpense)}`"
        :to="{ name: 'transactions', query: { type: 'Expense' } }"
      />
      <StatCard
        class="span-2"
        label="Number of transactions"
        icon="list"
        :style="{ '--i': 3 }"
        :value="stats.count"
        format="count"
        hint="Income and expense records"
        :to="{ name: 'transactions' }"
      />
      <StatCard
        class="span-3"
        label="Average expense"
        icon="barChart"
        :style="{ '--i': 4 }"
        :value="stats.averageExpense"
        tone="expense"
        hint="Per expense transaction"
        :to="{ name: 'transactions', query: { type: 'Expense', sort: 'amount-desc' } }"
      />
      <StatCard
        class="span-3"
        label="Top spending category"
        icon="star"
        :style="{ '--i': 5 }"
        :value="stats.topCategory || 'None yet'"
        format="text"
        :hint="stats.topCategory ? `${formatCurrency(stats.topCategoryAmount)} spent in total` : 'Add an expense to see this'"
        :to="stats.topCategory ? { name: 'transactions', query: { type: 'Expense', category: stats.topCategory } } : null"
      />
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1rem;
}

.span-2 {
  grid-column: span 2;
}

.span-3 {
  grid-column: span 3;
}

@media (max-width: 860px) {
  .stats__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .span-2,
  .span-3 {
    grid-column: span 1;
  }

  .span-2:first-child {
    grid-column: span 2;
  }
}

@media (max-width: 520px) {
  .stats__grid {
    grid-template-columns: 1fr;
  }

  .span-2:first-child {
    grid-column: span 1;
  }
}
</style>
