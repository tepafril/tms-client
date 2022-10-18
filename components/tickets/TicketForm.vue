<template>
  <div>
    <information v-model="form" @valid="onValid" :readOnly="readOnly" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TicketForm } from '~/types/form.interface'

import Information from '~/components/tickets/Information.vue'

export default Vue.extend({
  components: {
    Information,
  },
  props: {
    readOnly: {
      default: true,
      type: Boolean,
    },
    value: {
      default: () => <TicketForm>{},
      type: Object as () => TicketForm,
    },
  },
  watch: {
    value: {
      handler() {
        this.form = this.value
      },
      deep: true,
    },
    form: {
      handler() {
        this.$emit('input', this.form)
      },
      deep: true,
    },
    isValid: {
      handler() {
        this.$emit('valid', this.isValid)
      },
    },
  },
  data: () => ({
    form: {
      name: '',
      summary: '',
      description: '',
      type_id: '',
      severity_id: '',
      priority_id: '',
    } as TicketForm,
    isValid: false,
  }),
  computed: {},
  methods: {
    onValid(e: boolean) {
      this.isValid = e
    },
  },
  mounted() {
    this.form = this.value
  },
})
</script>

<style style="scss" scoped></style>
