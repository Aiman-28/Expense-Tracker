<script>
import { formatCompact, formatCurrency } from '@/utils/format'

const WIDTH = 640
const HEIGHT = 280
const PAD = { top: 16, right: 10, bottom: 32, left: 46 }

export default {
  name: 'MonthlyChart',

  props: {
    // [{ label, income, expense }]
    data: { type: Array, default: () => [] },
  },

  data() {
    return { WIDTH, HEIGHT, PAD }
  },

  computed: {
    innerWidth() {
      return WIDTH - PAD.left - PAD.right
    },

    innerHeight() {
      return HEIGHT - PAD.top - PAD.bottom
    },

    maxValue() {
      const highest = Math.max(0, ...this.data.flatMap((item) => [item.income, item.expense]))
      return this.niceMax(highest)
    },

    ticks() {
      return [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
        label: formatCompact(this.maxValue * fraction),
        y: PAD.top + this.innerHeight - fraction * this.innerHeight,
      }))
    },

    groups() {
      const groupWidth = this.innerWidth / Math.max(this.data.length, 1)
      const barWidth = Math.min(26, groupWidth * 0.28)
      return this.data.map((item, index) => {
        const center = PAD.left + index * groupWidth + groupWidth / 2
        const incomeHeight = (item.income / this.maxValue) * this.innerHeight
        const expenseHeight = (item.expense / this.maxValue) * this.innerHeight
        return {
          label: item.label,
          center,
          barWidth,
          income: {
            x: center - barWidth - 2,
            y: PAD.top + this.innerHeight - incomeHeight,
            height: incomeHeight,
            value: item.income,
          },
          expense: {
            x: center + 2,
            y: PAD.top + this.innerHeight - expenseHeight,
            height: expenseHeight,
            value: item.expense,
          },
        }
      })
    },
  },

  methods: {
    formatCurrency,

    // Round the top of the scale up to a tidy number (1, 2, 5 or 10 times a power of ten).
    niceMax(value) {
      if (value <= 0) return 1000
      const power = Math.pow(10, Math.floor(Math.log10(value)))
      const normalized = value / power
      const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
      return step * power
    },
  },
}
</script>

<template>
  <div class="chart">
    <div class="chart__legend">
      <span class="chart__key"><i class="chart__swatch chart__swatch--income"></i>Income</span>
      <span class="chart__key"><i class="chart__swatch chart__swatch--expense"></i>Expenses</span>
    </div>

    <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" aria-label="Income and expenses for the last six months">
      <g v-for="tick in ticks" :key="tick.y">
        <line :x1="PAD.left" :x2="WIDTH - PAD.right" :y1="tick.y" :y2="tick.y" class="chart__grid" />
        <text :x="PAD.left - 8" :y="tick.y + 4" text-anchor="end" class="chart__tick">{{ tick.label }}</text>
      </g>

      <g v-for="(group, index) in groups" :key="group.label">
        <rect
          :x="group.income.x"
          :y="group.income.y"
          :width="group.barWidth"
          :height="Math.max(group.income.height, 0)"
          rx="5"
          class="chart__bar chart__bar--income"
          :style="{ animationDelay: `${index * 70}ms` }"
        >
          <title>{{ group.label }} income: {{ formatCurrency(group.income.value) }}</title>
        </rect>
        <rect
          :x="group.expense.x"
          :y="group.expense.y"
          :width="group.barWidth"
          :height="Math.max(group.expense.height, 0)"
          rx="5"
          class="chart__bar chart__bar--expense"
          :style="{ animationDelay: `${index * 70 + 35}ms` }"
        >
          <title>{{ group.label }} expenses: {{ formatCurrency(group.expense.value) }}</title>
        </rect>
        <text :x="group.center" :y="HEIGHT - 10" text-anchor="middle" class="chart__tick">{{ group.label }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.chart svg {
  display: block;
  width: 100%;
  height: auto;
}

.chart__legend {
  display: flex;
  gap: 1.1rem;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-2);
}

.chart__key {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.chart__swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.chart__swatch--income,
.chart__bar--income {
  background: var(--income);
  fill: var(--income);
}

.chart__swatch--expense,
.chart__bar--expense {
  background: var(--expense);
  fill: var(--expense);
}

.chart__grid {
  stroke: var(--border);
  stroke-width: 1;
}

.chart__tick {
  fill: var(--text-3);
  font-size: 12px;
  font-family: var(--font-body);
}

.chart__bar {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: grow 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
