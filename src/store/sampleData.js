import { toISODate } from '@/utils/format'

const DAY = 24 * 60 * 60 * 1000

function daysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return toISODate(date)
}

// [description, amount, type, category, days ago]
const ROWS = [
  ['Monthly salary', 185000, 'Income', 'Salary', 3],
  ['Grocery shopping', 12400, 'Expense', 'Food & Dining', 1],
  ['House rent', 55000, 'Expense', 'Rent', 4],
  ['Freelance logo project', 32000, 'Income', 'Freelance', 8],
  ['Electricity bill', 9800, 'Expense', 'Bills & Utilities', 6],
  ['Ride-hailing trips', 3600, 'Expense', 'Transport', 9],
  ['Streaming subscriptions', 2500, 'Expense', 'Entertainment', 11],
  ['Doctor consultation', 4500, 'Expense', 'Health', 14],
  ['Online course', 15000, 'Expense', 'Education', 18],
  ['Dinner with friends', 6200, 'Expense', 'Food & Dining', 22],
  ['Running shoes', 14500, 'Expense', 'Shopping', 27],
  ['Monthly salary', 185000, 'Income', 'Salary', 33],
  ['House rent', 55000, 'Expense', 'Rent', 34],
  ['Freelance website build', 48000, 'Income', 'Freelance', 40],
  ['Weekend trip to Murree', 38000, 'Expense', 'Travel', 52],
  ['Stock dividends', 11500, 'Income', 'Investment', 58],
  ['Monthly salary', 185000, 'Income', 'Salary', 63],
  ['House rent', 55000, 'Expense', 'Rent', 64],
  ['Grocery shopping', 15800, 'Expense', 'Food & Dining', 70],
  ['Gift from uncle', 10000, 'Income', 'Gift', 80],
  ['Monthly salary', 185000, 'Income', 'Salary', 94],
  ['House rent', 55000, 'Expense', 'Rent', 95],
  ['Phone repair', 7500, 'Expense', 'Shopping', 110],
  ['Gas and water bills', 11200, 'Expense', 'Bills & Utilities', 100],
  ['Monthly salary', 185000, 'Income', 'Salary', 124],
  ['House rent', 55000, 'Expense', 'Rent', 125],
  ['Freelance mobile app', 60000, 'Income', 'Freelance', 130],
]

export function createSampleTransactions() {
  return ROWS.map(([description, amount, type, category, days], index) => ({
    id: `sample-${index + 1}`,
    description,
    amount,
    type,
    category,
    date: daysAgo(days),
    createdAt: Date.now() - days * DAY,
    updatedAt: null,
  }))
}
