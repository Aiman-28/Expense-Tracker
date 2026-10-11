<script>
import AppHeader from '@/components/AppHeader.vue'
import ToastContainer from '@/components/ToastContainer.vue'

export default {
  name: 'App',
  components: { AppHeader, ToastContainer },
}
</script>

<template>
  <AppHeader />
  <main class="container">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <ToastContainer />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.14s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
