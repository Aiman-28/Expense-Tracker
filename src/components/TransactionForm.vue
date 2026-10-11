<script>
import { CATEGORIES, TYPE_EXPENSE, TYPES } from '@/utils/constants'
import { todayISO } from '@/utils/format'

const MAX_AMOUNT = 100000000
const MAX_DESCRIPTION = 60
const MIN_DATE = '2000-01-01'

export default {
  name: 'TransactionForm',

  props: {
    // Pass an existing transaction to edit it, or null to create a new one.
    transaction: { type: Object, default: null },
  },

  emits: ['submit', 'cancel'],

  data() {
    return {
      types: TYPES,
      MAX_DESCRIPTION,
      MIN_DATE,
      today: todayISO(),
      form: {
        description: '',
        amount: '',
        type: TYPE_EXPENSE,
        category: '',
        date: todayISO(),
      },
      errors: { description: '', amount: '', category: '', date: '' },
    }
  },

  computed: {
    isEditing() {
      return this.transaction !== null
    },
    // Categories depend on the selected type.
    categoryOptions() {
      return CATEGORIES[this.form.type]
    },
  },

  watch: {
    transaction(value) {
      this.fillForm(value)
    },
    // Clear a category that no longer applies after the type changes.
    'form.type'() {
      if (!this.categoryOptions.includes(this.form.category)) {
        this.form.category = ''
        this.errors.category = ''
      }
    },
  },

  created() {
    this.fillForm(this.transaction)
  },

  mounted() {
    this.$refs.descriptionInput?.focus()
  },

  methods: {
    fillForm(transaction) {
      if (!transaction) return
      this.form.description = transaction.description
      this.form.amount = String(transaction.amount)
      this.form.type = transaction.type
      this.form.category = transaction.category
      this.form.date = transaction.date
    },

    checkDescription() {
      const value = this.form.description.trim()
      if (!value) return 'Enter a description.'
      if (value.length < 3) return 'Description needs at least 3 characters.'
      if (value.length > MAX_DESCRIPTION) return `Description can be at most ${MAX_DESCRIPTION} characters.`
      return ''
    },

    checkAmount() {
      const raw = String(this.form.amount).trim()
      if (raw === '') return 'Enter an amount.'
      const number = Number(raw)
      if (!Number.isFinite(number)) return 'Amount must be a number.'
      if (number <= 0) return 'Amount must be greater than zero.'
      if (number > MAX_AMOUNT) return `Amount can be at most ${MAX_AMOUNT.toLocaleString('en-US')}.`
      if (!/^\d+(\.\d{1,2})?$/.test(raw)) return 'Use a plain number with up to two decimals, like 1500.50.'
      return ''
    },

    checkCategory() {
      return this.form.category ? '' : 'Choose a category.'
    },

    checkDate() {
      if (!this.form.date) return 'Pick a date.'
      if (Number.isNaN(new Date(`${this.form.date}T00:00:00`).getTime())) return 'Enter a valid date.'
      if (this.form.date > this.today) return 'Date cannot be in the future.'
      if (this.form.date < MIN_DATE) return 'Date is too far in the past.'
      return ''
    },

    validateField(name) {
      const checks = {
        description: this.checkDescription,
        amount: this.checkAmount,
        category: this.checkCategory,
        date: this.checkDate,
      }
      this.errors[name] = checks[name]()
      return this.errors[name] === ''
    },

    // Once a field has shown an error, re-check it as the user types so the message clears right away.
    revalidate(name) {
      if (this.errors[name]) this.validateField(name)
    },

    validateAll() {
      // map() (not every()) so every invalid field shows its message at once.
      return ['description', 'amount', 'category', 'date'].map(this.validateField).every(Boolean)
    },

    async handleSubmit() {
      if (!this.validateAll()) {
        await this.$nextTick()
        this.$refs.formEl?.querySelector('[aria-invalid="true"]')?.focus()
        return
      }
      this.$emit('submit', {
        description: this.form.description.trim(),
        amount: Number(Number(this.form.amount).toFixed(2)),
        type: this.form.type,
        category: this.form.category,
        date: this.form.date,
      })
    },
  },
}
</script>

<template>
  <form ref="formEl" class="form" novalidate @submit.prevent="handleSubmit">
    <div class="field">
      <span class="field__label" id="type-label">Type</span>
      <div class="type-toggle" role="radiogroup" aria-labelledby="type-label">
        <label v-for="type in types" :key="type" class="type-toggle__option" :class="[`is-${type.toLowerCase()}`, { 'is-selected': form.type === type }]">
          <input v-model="form.type" class="sr-only" type="radio" name="type" :value="type" />
          {{ type }}
        </label>
      </div>
    </div>

    <div class="field">
      <label class="field__label" for="tx-description">Description</label>
      <input
        id="tx-description"
        ref="descriptionInput"
        v-model="form.description"
        class="input"
        :class="{ 'is-invalid': errors.description }"
        type="text"
        placeholder="e.g. Grocery shopping"
        :maxlength="MAX_DESCRIPTION + 20"
        :aria-invalid="errors.description ? 'true' : 'false'"
        aria-describedby="tx-description-error"
        @blur="validateField('description')"
        @input="revalidate('description')"
      />
      <p v-if="errors.description" id="tx-description-error" class="field__error">{{ errors.description }}</p>
    </div>

    <div class="form__row">
      <div class="field">
        <label class="field__label" for="tx-amount">Amount (PKR)</label>
        <input
          id="tx-amount"
          v-model="form.amount"
          class="input num"
          :class="{ 'is-invalid': errors.amount }"
          type="number"
          inputmode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          :aria-invalid="errors.amount ? 'true' : 'false'"
          aria-describedby="tx-amount-error"
          @blur="validateField('amount')"
          @input="revalidate('amount')"
        />
        <p v-if="errors.amount" id="tx-amount-error" class="field__error">{{ errors.amount }}</p>
      </div>

      <div class="field">
        <label class="field__label" for="tx-date">Date</label>
        <input
          id="tx-date"
          v-model="form.date"
          class="input"
          :class="{ 'is-invalid': errors.date }"
          type="date"
          :min="MIN_DATE"
          :max="today"
          :aria-invalid="errors.date ? 'true' : 'false'"
          aria-describedby="tx-date-error"
          @blur="validateField('date')"
          @change="revalidate('date')"
        />
        <p v-if="errors.date" id="tx-date-error" class="field__error">{{ errors.date }}</p>
      </div>
    </div>

    <div class="field">
      <label class="field__label" for="tx-category">Category</label>
      <select
        id="tx-category"
        v-model="form.category"
        class="input"
        :class="{ 'is-invalid': errors.category }"
        :aria-invalid="errors.category ? 'true' : 'false'"
        aria-describedby="tx-category-error"
        @blur="validateField('category')"
        @change="revalidate('category')"
      >
        <option value="" disabled>Choose a category</option>
        <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
      </select>
      <p v-if="errors.category" id="tx-category-error" class="field__error">{{ errors.category }}</p>
    </div>

    <div class="form__actions">
      <button class="btn btn-ghost" type="button" @click="$emit('cancel')">Cancel</button>
      <button class="btn btn-primary" type="submit">{{ isEditing ? 'Save changes' : 'Add transaction' }}</button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.4rem;
}

.type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.type-toggle__option {
  padding: 0.7rem;
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--surface);
  text-align: center;
  font-weight: 600;
  color: var(--text-2);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s ease;
}

.type-toggle__option:active {
  transform: scale(0.97);
}

.type-toggle__option:hover {
  border-color: var(--text-3);
}

.type-toggle__option:focus-within {
  outline: 3px solid var(--ring);
  outline-offset: 2px;
}

.type-toggle__option.is-selected.is-income {
  background: linear-gradient(135deg, var(--income-soft), transparent);
  border-color: var(--income);
  color: var(--income);
}

.type-toggle__option.is-selected.is-expense {
  background: linear-gradient(135deg, var(--expense-soft), transparent);
  border-color: var(--expense);
  color: var(--expense);
}

@media (max-width: 560px) {
  .form__row {
    grid-template-columns: 1fr;
  }

  .form__actions .btn {
    flex: 1;
  }
}
</style>
