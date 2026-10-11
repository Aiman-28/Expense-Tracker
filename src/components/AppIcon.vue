<script>
import { ICONS } from '@/utils/icons'

export default {
  name: 'AppIcon',

  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: 20 },
  },

  computed: {
    // Unknown names fall back to a neutral "more" icon instead of rendering nothing.
    body() {
      return ICONS[this.name] ?? ICONS.dots
    },
  },
}
</script>

<template>
  <svg
    class="app-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :width="size"
    :height="size"
    aria-hidden="true"
    focusable="false"
    v-html="body"
  />
</template>
