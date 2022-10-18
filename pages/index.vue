<template></template>

<script lang="ts">
import Vue from 'vue'
import { MainStore } from '~/store'

export default Vue.extend({
  layout: 'unauthenticated',
  auth: true,
  mounted() {
    if (!MainStore.NuxtContext.getAuth().loggedIn) this.$router.push('/login')
  },
})
</script>
