<script>
const THEME_KEY = 'expense-tracker:theme'

export default {
  name: 'AppHeader',

  data() {
    return {
      // index.html already applied the saved theme; read it back so the toggle matches.
      theme: document.documentElement.getAttribute('data-theme') || 'light',
    }
  },

  watch: {
    theme(value) {
      document.documentElement.setAttribute('data-theme', value)
      try {
        localStorage.setItem(THEME_KEY, value)
      } catch {
        // Storage can be unavailable (private mode); the theme still changes for this session.
      }
    },
  },

  methods: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
    },
  },
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="brand" aria-label="Expense Tracker home">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="7" fill="#f2b134" /></svg>
        </span>
        <span class="brand__name">Expense Tracker</span>
      </RouterLink>

      <nav class="nav" aria-label="Main">
        <RouterLink :to="{ name: 'dashboard' }" class="nav__link">Dashboard</RouterLink>
        <RouterLink :to="{ name: 'transactions' }" class="nav__link">Transactions</RouterLink>
      </nav>

      <button
        class="btn-icon"
        type="button"
        :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      >
        <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </button>
    </div>

    <nav class="tabbar" aria-label="Main">
      <RouterLink :to="{ name: 'dashboard' }" class="tabbar__link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
        Dashboard
      </RouterLink>
      <RouterLink :to="{ name: 'transactions' }" class="tabbar__link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h13M4 12h16M4 17h10" />
        </svg>
        Transactions
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

/* Thin gradient line under the header. */
.header::after {
  content: '';
  position: absolute;
  inset: auto 0 -1px 0;
  height: 2px;
  background: var(--grad-accent);
  opacity: 0.85;
}

.header__inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.8rem 1.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-right: auto;
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--grad-hero);
  box-shadow: 0 6px 14px -8px #14604f;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.brand:hover .brand__mark {
  transform: rotate(-12deg) scale(1.1);
}

.brand__mark svg {
  width: 22px;
  height: 22px;
}

.brand__name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav {
  display: flex;
  gap: 0.25rem;
}

.nav__link {
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-2);
  transition: background 0.2s, color 0.2s, transform 0.18s ease, box-shadow 0.25s;
}

.nav__link:hover {
  color: var(--text);
  background: linear-gradient(135deg, var(--grad-soft-a), var(--grad-soft-b));
  transform: translateY(-1px);
}

.nav__link.router-link-active {
  background: var(--grad-brand);
  color: var(--grad-text);
  box-shadow: 0 8px 16px -10px var(--grad-a);
}

/* Mobile: the nav moves to a bar at the bottom of the screen. */
.tabbar {
  display: none;
}

@media (max-width: 720px) {
  .nav {
    display: none;
  }

  .header__inner {
    padding: 0.7rem 1rem;
  }

  .tabbar {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 40;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem calc(0.5rem + env(safe-area-inset-bottom));
    background: var(--surface);
    border-top: 1px solid var(--border);
  }

  .tabbar__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    padding: 0.45rem;
    border-radius: var(--r-sm);
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--text-3);
  }

  .tabbar__link svg {
    width: 22px;
    height: 22px;
  }

  .tabbar__link.router-link-active {
    color: var(--brand);
    background: linear-gradient(135deg, var(--grad-soft-a), var(--grad-soft-b));
  }
}
</style>
