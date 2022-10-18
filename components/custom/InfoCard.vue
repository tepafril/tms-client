<template>
  <v-card :class="`pa-6 ${color}--border rounded-xl`" outlined height="100%">
    <div :class="`d-flex justify-space-between align-start ${color}--text`">
      <div class="d-flex flex-column flex-grow-1">
        <span class="text-h6 font-weight-medium">{{ title }}</span>
        <div v-if="desc" class="d-flex align-center">
          <span class="text-h5 font-weight-semibold">{{ desc }}</span>
        </div>
      </div>
      <v-avatar :size="iconSize">
        <v-icon :size="iconSize * 0.75" :color="`${color}`">{{ icon }}</v-icon>
      </v-avatar>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

interface SubItem {
  title: string
  value: string
}

export default Vue.extend({
  props: {
    title: {
      default: '',
      type: String,
      required: true,
    },
    desc: {
      default: '0',
      type: String,
    },
    color: {
      default: 'primary',
      type: String,
    },
    icon: {
      default: '',
      type: String,
    },
    iconSize: {
      default: 64,
      type: Number,
    },
  },
  watch: {},
  data: () => ({}),
  computed: {},
  methods: {},
  mounted() {},
})
</script>

<style scoped>
.primary--border {
  border-color: var(--v-primary-base);
}
.accent--border {
  border-color: var(--v-accent-base);
}
.blue--border {
  border-color: var(--v-blue-base);
}
.green--border {
  border-color: var(--v-green-base);
}
.red--border {
  border-color: var(--v-red-base);
}
.warning--border {
  border-color: var(--v-warning-base);
}
</style>
