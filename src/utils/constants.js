export const TYPE_INCOME = 'Income'
export const TYPE_EXPENSE = 'Expense'
export const TYPES = [TYPE_INCOME, TYPE_EXPENSE]

export const CATEGORIES = {
  [TYPE_INCOME]: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other Income'],
  [TYPE_EXPENSE]: [
    'Food & Dining',
    'Rent',
    'Transport',
    'Shopping',
    'Bills & Utilities',
    'Health',
    'Entertainment',
    'Education',
    'Travel',
    'Other Expense',
  ],
}

export const ALL_CATEGORIES = [...CATEGORIES[TYPE_INCOME], ...CATEGORIES[TYPE_EXPENSE]]

// Each category gets a colour, an icon name (see utils/icons.js) and a two-letter mark.
export const CATEGORY_META = {
  Salary: { mark: 'Sa', icon: 'banknote', color: '#0E8A5F' },
  Freelance: { mark: 'Fr', icon: 'laptop', color: '#2A9D8F' },
  Business: { mark: 'Bu', icon: 'briefcase', color: '#3D7EA6' },
  Investment: { mark: 'In', icon: 'trendingUp', color: '#6A8D36' },
  Gift: { mark: 'Gi', icon: 'gift', color: '#B5651D' },
  'Other Income': { mark: 'Oi', icon: 'plusCircle', color: '#5C7A6E' },
  'Food & Dining': { mark: 'Fd', icon: 'utensils', color: '#E07A2F' },
  Rent: { mark: 'Re', icon: 'home', color: '#7C5CBF' },
  Transport: { mark: 'Tr', icon: 'bus', color: '#3F7CD8' },
  Shopping: { mark: 'Sh', icon: 'bag', color: '#C2437A' },
  'Bills & Utilities': { mark: 'Bi', icon: 'zap', color: '#C9A227' },
  Health: { mark: 'He', icon: 'heart', color: '#D93F46' },
  Entertainment: { mark: 'En', icon: 'play', color: '#8E4FD0' },
  Education: { mark: 'Ed', icon: 'cap', color: '#1F8A9E' },
  Travel: { mark: 'Tv', icon: 'plane', color: '#D9633F' },
  'Other Expense': { mark: 'Ox', icon: 'dots', color: '#7D8A85' },
}

export function getCategoryMeta(category) {
  return CATEGORY_META[category] ?? { mark: '?', icon: 'dots', color: '#7D8A85' }
}

export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Highest amount' },
  { value: 'amount-asc', label: 'Lowest amount' },
]
