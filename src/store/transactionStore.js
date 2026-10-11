import { reactive } from 'vue'
import { createSampleTransactions } from './sampleData'
import { TYPE_EXPENSE, TYPE_INCOME, getCategoryMeta } from '@/utils/constants'

const STORAGE_KEY = 'expense-tracker:transactions'

const round = (value) => Math.round(value * 100) / 100

function isValidRecord(record) {
  return (
    record &&
    typeof record === 'object' &&
    typeof record.id === 'string' &&
    typeof record.description === 'string' &&
    Number.isFinite(Number(record.amount)) &&
    [TYPE_INCOME, TYPE_EXPENSE].includes(record.type) &&
    typeof record.category === 'string' &&
    typeof record.date === 'string'
  )
}

// Load saved records. A first-time visitor starts with an empty list and can choose
// "Load sample data" from the empty state; nothing is added behind their back.
function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter(isValidRecord).map((record) => ({ ...record, amount: Number(record.amount) }))
      }
    }
  } catch (error) {
    console.warn('Could not read saved transactions, starting empty.', error)
  }
  return []
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

// The single source of truth. Components wrap the getters below in `computed` properties,
// so they re-calculate automatically whenever this reactive state changes.
export const state = reactive({ transactions: loadTransactions() })

// Write the current records to localStorage. Called after every add, edit and delete.
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions))
  } catch (error) {
    console.warn('Could not save transactions.', error)
  }
}

save()

const byDateDesc = (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt
const sumOf = (type) =>
  round(state.transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0))

export const getters = {
  all() {
    return state.transactions
  },

  sortedByDate() {
    return [...state.transactions].sort(byDateDesc)
  },

  count() {
    return state.transactions.length
  },

  totalIncome() {
    return sumOf(TYPE_INCOME)
  },

  totalExpenses() {
    return sumOf(TYPE_EXPENSE)
  },

  balance() {
    return round(getters.totalIncome() - getters.totalExpenses())
  },

  averageExpense() {
    const expenses = state.transactions.filter((t) => t.type === TYPE_EXPENSE)
    return expenses.length ? round(getters.totalExpenses() / expenses.length) : 0
  },

  // Expense totals per category, largest first.
  expensesByCategory() {
    const totals = new Map()
    for (const t of state.transactions) {
      if (t.type !== TYPE_EXPENSE) continue
      totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
    }
    return [...totals.entries()]
      .map(([label, value]) => ({ label, value: round(value), color: getCategoryMeta(label).color }))
      .sort((a, b) => b.value - a.value)
  },

  topExpenseCategory() {
    return getters.expensesByCategory()[0]?.label ?? null
  },

  // Top five categories plus one combined slice, so the donut chart stays readable.
  expenseBreakdown() {
    const list = getters.expensesByCategory()
    if (list.length <= 6) return list
    const rest = list.slice(5).reduce((sum, item) => sum + item.value, 0)
    return [...list.slice(0, 5), { label: 'Everything else', value: round(rest), color: '#9AA8A2' }]
  },

  // Income vs. expenses for the last six calendar months.
  monthlySummary() {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('en-GB', { month: 'short' }),
        income: 0,
        expense: 0,
      })
    }
    for (const t of state.transactions) {
      const month = months.find((m) => m.key === t.date.slice(0, 7))
      if (!month) continue
      if (t.type === TYPE_INCOME) month.income = round(month.income + t.amount)
      else month.expense = round(month.expense + t.amount)
    }
    return months
  },

  thisMonth() {
    const months = getters.monthlySummary()
    return months[months.length - 1]
  },

  // Running balance at the end of each of the last six months.
  balanceTrend() {
    return getters.monthlySummary().map((month) => {
      const endKey = `${month.key}-31`
      const value = state.transactions
        .filter((t) => t.date <= endKey)
        .reduce((sum, t) => sum + (t.type === TYPE_INCOME ? t.amount : -t.amount), 0)
      return { label: month.label, value: round(value) }
    })
  },
}

export const actions = {
  add(data) {
    const record = { id: generateId(), ...data, createdAt: Date.now(), updatedAt: null }
    state.transactions.unshift(record)
    save()
    return record
  },

  update(id, data) {
    const record = state.transactions.find((t) => t.id === id)
    if (!record) return null
    Object.assign(record, data, { updatedAt: Date.now() })
    save()
    return record
  },

  remove(id) {
    const index = state.transactions.findIndex((t) => t.id === id)
    if (index === -1) return false
    state.transactions.splice(index, 1)
    save()
    return true
  },

  getById(id) {
    return state.transactions.find((t) => t.id === id)
  },

  resetToSampleData() {
    state.transactions = createSampleTransactions()
    save()
  },

}
