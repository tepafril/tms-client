<template>
  <div class="pa-8">
    <div class="mb-8">
      <p class="text-h6 mb-0 text1--text font-weight-medium">Information</p>
    </div>
    <v-form v-model="isValid" @submit.prevent>
      <div class="d-flex">
        <v-autocomplete
          dense
          height="48"
          class="mb-6"
          label="Ticket Type"
          outlined
          hide-details="auto"
          :items="ticketTypes"
          item-disabled="disable"
          :rules="[requiredRule]"
          item-value="id"
          v-model="form.type_id"
          :disabled="readOnly"
        >
          <template v-slot:selection="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
        </v-autocomplete>
      </div>
      <div class="d-flex">
        <v-text-field
          dense
          height="48"
          label="Title"
          outlined
          class="mb-6"
          hide-details="auto"
          :rules="[requiredRule]"
          v-model="form.name"
          :disabled="readOnly"
        ></v-text-field>
      </div>
      <div class="d-flex">
        <v-textarea
          dense
          label="Summary"
          outlined
          class="mb-6"
          hide-details="auto"
          :rules="[requiredRule]"
          v-model="form.summary"
          :disabled="readOnly"
        ></v-textarea>
      </div>
      <div class="d-flex">
        <v-textarea
          dense
          label="Description"
          outlined
          class="mb-6"
          hide-details="auto"
          :rules="[requiredRule]"
          v-model="form.description"
          :disabled="readOnly"
        ></v-textarea>
      </div>
      <div class="d-flex">
        <v-autocomplete
          dense
          height="48"
          class="mb-6 mr-6"
          label="Severity"
          outlined
          hide-details="auto"
          :items="ticketLevels"
          item-value="id"
          v-model="form.severity_id"
          :disabled="readOnly"
        >
          <template v-slot:selection="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
        </v-autocomplete>
        <v-autocomplete
          dense
          height="48"
          class="mb-6"
          label="Priority"
          outlined
          hide-details="auto"
          :items="ticketLevels"
          item-value="id"
          v-model="form.priority_id"
          :disabled="readOnly"
        >
          <template v-slot:selection="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
        </v-autocomplete>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TicketService from '~/services/ticket.service'
import { MainStore } from '~/store'
import { TicketForm } from '~/types/form.interface'

export default Vue.extend({
  components: {},
  props: {
    value: {
      default: <TicketForm>{},
      type: Object as () => TicketForm,
    },
    categoryDisabled: {
      default: false,
      type: Boolean,
    },
    readOnly: {
      default: true,
      type: Boolean,
    },
  },
  watch: {
    value: {
      handler() {
        this.form = this.value
      },
      deep: true,
    },
    information: {
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
    isValid: false,
    requiredRule: (v: string) => !!v || 'Field is required',
    form: {
      name: '',
      summary: '',
      description: '',
      type_id: '',
      severity_id: '',
      priority_id: '',
    } as TicketForm,
    ticketTypes: [],
    ticketLevels: [],
  }),
  computed: {},
  methods: {
    async getTicketTypes() {
      try {
        let service = new TicketService()
        const response = await service.ticketTypes()
        this.ticketTypes = response.data.types.map((x: any) => {
          const disable = response.data.disabled_types.some(
            (y: any) => x.id === y.id
          )
          return { disable: disable, ...x }
        })
      } catch (err: any) {
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: err.response.data.message,
          color: 'error',
        })
      }
    },
    async getTicketLevels() {
      try {
        let service = new TicketService()
        const response = await service.ticketLevels()
        this.ticketLevels = response.data.levels
      } catch (err: any) {
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: err.response.data.message,
          color: 'error',
        })
      }
    },
  },
  async mounted() {
    await this.getTicketTypes()
    await this.getTicketLevels()
    this.form = this.value
  },
})
</script>

<style style="scss" scoped></style>
