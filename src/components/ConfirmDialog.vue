<script>
import ModalDialog from './ModalDialog.vue'

export default {
  name: 'ConfirmDialog',
  components: { ModalDialog },

  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: 'Delete this transaction?' },
    message: { type: String, default: '' },
    confirmText: { type: String, default: 'Delete' },
  },

  emits: ['confirm', 'cancel'],
}
</script>

<template>
  <ModalDialog :open="open" :title="title" size="sm" @close="$emit('cancel')">
    <p class="message">{{ message }}</p>
    <div class="actions">
      <button class="btn btn-ghost" type="button" @click="$emit('cancel')">Keep it</button>
      <button class="btn btn-danger" type="button" @click="$emit('confirm')">{{ confirmText }}</button>
    </div>
  </ModalDialog>
</template>

<style scoped>
.message {
  color: var(--text-2);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.5rem;
}
</style>
