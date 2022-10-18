import { defineStore } from 'pinia'

export const useNuxtContextStore = defineStore({
  id: 'nuxtContext',
  state: () => ({}),
  getters: {},
  actions: {
    getContext() {
      return this.$nuxt
    },
  },
})
