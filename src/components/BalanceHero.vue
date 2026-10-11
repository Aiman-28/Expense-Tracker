<script>
import { formatCurrency } from '@/utils/format'

export default {
  name: 'BalanceHero',

  props: {
    balance: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
    trend: { type: Array, default: () => [] },
  },

  data() {
    return {
      // The balance counts up once when the dashboard opens, and again whenever it changes.
      displayed: 0,
      frame: null,
      WIDTH: 320,
      HEIGHT: 96,
      PAD: 8,
    }
  },

  computed: {
    note() {
      if (this.income === 0 && this.expenses === 0) return 'Add your first transaction to see your balance grow.'
      if (this.income === 0) return 'No income recorded yet.'
      if (this.balance < 0) return 'You have spent more than you earned.'
      const kept = Math.round((this.balance / this.income) * 100)
      return `You have kept ${kept}% of everything you earned.`
    },

    // Sparkline points for the running balance of the last six months.
    points() {
      const values = this.trend.map((item) => item.value)
      if (values.length < 2) return []
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min || 1
      return values.map((value, index) => ({
        x: this.PAD + (index / (values.length - 1)) * (this.WIDTH - this.PAD * 2),
        y: this.PAD + (1 - (value - min) / range) * (this.HEIGHT - this.PAD * 2),
      }))
    },

    linePath() {
      return this.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    },

    areaPath() {
      if (!this.points.length) return ''
      const first = this.points[0]
      const last = this.points[this.points.length - 1]
      return `${this.linePath} L${last.x.toFixed(1)} ${this.HEIGHT} L${first.x.toFixed(1)} ${this.HEIGHT} Z`
    },

    lastPoint() {
      return this.points[this.points.length - 1]
    },
  },

  watch: {
    balance: {
      handler: 'animateTo',
      immediate: true,
    },
  },

  beforeUnmount() {
    cancelAnimationFrame(this.frame)
  },

  methods: {
    formatCurrency,

    animateTo(target) {
      cancelAnimationFrame(this.frame)
      const from = this.displayed
      const startedAt = performance.now()
      const duration = 900
      const step = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        this.displayed = progress < 1 ? Math.round(from + (target - from) * eased) : target
        if (progress < 1) this.frame = requestAnimationFrame(step)
      }
      this.frame = requestAnimationFrame(step)
    },
  },
}
</script>

<template>
  <section class="hero" aria-label="Current balance">
    <div class="hero__main">
      <p class="hero__label">Current balance</p>
      <p class="hero__amount num" :class="{ 'is-negative': balance < 0 }">{{ formatCurrency(displayed) }}</p>
      <p class="hero__note">{{ note }}</p>
    </div>

    <div v-if="points.length" class="hero__trend">
      <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" aria-label="Balance over the last six months">
        <path :d="areaPath" class="hero__area" />
        <path :d="linePath" class="hero__line" pathLength="1" />
        <circle v-if="lastPoint" :cx="lastPoint.x" :cy="lastPoint.y" r="4.5" class="hero__dot" />
      </svg>
      <div class="hero__months" aria-hidden="true">
        <span v-for="item in trend" :key="item.label">{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: center;
  gap: 2rem;
  padding: 2rem 2.25rem;
  border-radius: var(--r-lg);
  background: var(--grad-hero);
  color: #f2f7f4;
}

.hero__label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(242, 247, 244, 0.72);
}

.hero__amount {
  margin-top: 0.35rem;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5.5vw, 3.6rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  overflow-wrap: anywhere;
}

.hero__amount.is-negative {
  color: #ffb3b6;
}

.hero__note {
  margin-top: 0.7rem;
  color: rgba(242, 247, 244, 0.78);
}

.hero__trend svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.hero__area {
  fill: var(--saffron);
  opacity: 0.12;
}

.hero__line {
  fill: none;
  stroke: var(--saffron);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1.1s 0.15s ease-out forwards;
}

.hero__dot {
  fill: var(--saffron);
  stroke: var(--hero-bg);
  stroke-width: 3;
  vector-effect: non-scaling-stroke;
}

.hero__months {
  display: flex;
  justify-content: space-between;
  margin-top: 0.6rem;
  font-size: 0.78rem;
  color: rgba(242, 247, 244, 0.6);
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (max-width: 720px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem 1.25rem;
  }
}
</style>
