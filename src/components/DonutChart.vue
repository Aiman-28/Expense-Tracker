<script>
import { formatCurrencyCompact } from '@/utils/format'

const RADIUS = 70
const STROKE = 22

export default {
  name: 'DonutChart',

  props: {
    // [{ label, value, color }]
    segments: { type: Array, default: () => [] },
    centerLabel: { type: String, default: 'Total spent' },
  },

  data() {
    return {
      RADIUS,
      STROKE,
      CIRCUMFERENCE: 2 * Math.PI * RADIUS,
      hovered: null,
    }
  },

  computed: {
    total() {
      return this.segments.reduce((sum, item) => sum + item.value, 0)
    },

    arcs() {
      let offset = 0
      return this.segments.map((segment) => {
        const share = this.total ? segment.value / this.total : 0
        const length = share * this.CIRCUMFERENCE
        const arc = { ...segment, share, length, offset }
        offset += length
        return arc
      })
    },

    active() {
      return this.hovered === null ? null : this.arcs[this.hovered]
    },
  },

  methods: {
    formatCurrencyCompact,
  },
}
</script>

<template>
  <div v-if="segments.length" class="donut">
    <div class="donut__chart">
      <svg viewBox="0 0 200 200" role="img" aria-label="Expenses by category">
        <circle cx="100" cy="100" :r="RADIUS" fill="none" class="donut__track" :stroke-width="STROKE" />
        <g transform="rotate(-90 100 100)">
          <circle
            v-for="(arc, index) in arcs"
            :key="arc.label"
            cx="100"
            cy="100"
            :r="RADIUS"
            fill="none"
            :stroke="arc.color"
            :stroke-width="hovered === index ? STROKE + 5 : STROKE"
            :stroke-dasharray="`${Math.max(arc.length - 2, 0)} ${CIRCUMFERENCE}`"
            :stroke-dashoffset="-arc.offset"
            class="donut__arc"
            @mouseenter="hovered = index"
            @mouseleave="hovered = null"
          />
        </g>
      </svg>
      <div class="donut__center">
        <span class="donut__center-label">{{ active ? active.label : centerLabel }}</span>
        <strong class="donut__center-value num">{{ formatCurrencyCompact(active ? active.value : total) }}</strong>
      </div>
    </div>

    <ul class="donut__legend">
      <li
        v-for="(arc, index) in arcs"
        :key="arc.label"
        class="donut__item"
        :class="{ 'is-active': hovered === index }"
        @mouseenter="hovered = index"
        @mouseleave="hovered = null"
      >
        <span class="donut__swatch" :style="{ background: arc.color }" aria-hidden="true"></span>
        <span class="donut__name">{{ arc.label }}</span>
        <span class="donut__pct num">{{ Math.round(arc.share * 100) }}%</span>
      </li>
    </ul>
  </div>
  <p v-else class="donut__empty muted">No expenses yet, so there is nothing to chart.</p>
</template>

<style scoped>
.donut {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.donut__chart {
  position: relative;
  width: 100%;
  max-width: 220px;
}

.donut__chart svg {
  display: block;
  width: 100%;
}

.donut__track {
  stroke: var(--surface-2);
}

.donut__arc {
  transition: stroke-width 0.15s ease;
  cursor: pointer;
}

.donut__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 2.4rem;
  text-align: center;
  pointer-events: none;
}

.donut__center-label {
  max-width: 100%;
  overflow: hidden;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.donut__center-value {
  font-family: var(--font-display);
  font-size: 1.15rem;
}

.donut__legend {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  width: 100%;
}

.donut__item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.donut__item.is-active {
  background: var(--surface-2);
}

.donut__swatch {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 3px;
}

.donut__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.donut__pct {
  font-weight: 700;
  color: var(--text-2);
}

.donut__empty {
  padding: 2rem 0;
  text-align: center;
}
</style>
