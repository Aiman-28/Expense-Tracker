import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/Transactions.vue'),
    meta: { title: 'Transactions' },
  },
  {
    path: '/transactions/:id',
    name: 'details',
    component: () => import('@/views/Details.vue'),
    props: true,
    meta: { title: 'Transaction details' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  // Hash history keeps the app working on any static host without server config.
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'Expense Tracker'} | Expense Tracker`
})

export default router
