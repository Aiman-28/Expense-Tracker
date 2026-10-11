const currencyOptions = { style: 'currency', currency: 'PKR' }
const wholeFormatter = new Intl.NumberFormat('en-PK', { ...currencyOptions, minimumFractionDigits: 0, maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat('en-PK', { ...currencyOptions, minimumFractionDigits: 2, maximumFractionDigits: 2 })

const compactFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

// Whole amounts show no decimals (Rs 1,500); fractional ones always show two (Rs 4,200.50).
export const formatCurrency = (value) => (Number.isInteger(value) ? wholeFormatter : decimalFormatter).format(value)
export const formatCompact = (value) => compactFormatter.format(value)
export const formatCurrencyCompact = (value) => `Rs ${compactFormatter.format(value)}`

const pad = (n) => String(n).padStart(2, '0')

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const todayISO = () => toISODate(new Date())

// Parse "YYYY-MM-DD" as a local date (avoids timezone shifts from new Date(string)).
export function parseISODate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(iso) {
  return parseISODate(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatLongDate(iso) {
  return parseISODate(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
