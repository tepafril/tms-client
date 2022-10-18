<template>
  <v-card flat tile>
    <v-card
      flat
      tile
      dark
      class="d-flex accent py-4 px-8 accent justify-space-between"
    >
      <span class="font-weight-semibold text-h6 mb-0">Ticket Detail</span>
      <v-icon @click="MainStore.LayoutSpliter.toggle({}, false)"
        >mdi-close</v-icon
      >
    </v-card>
    <div class="scrolling-div-edited">
      <ticket-form v-model="form" @valid="onFormValid" :readOnly="!canEdit" />
    </div>
    <div class="d-flex py-6 px-8">
      <v-spacer></v-spacer>
      <v-btn
        class="text1--text mr-4"
        text
        @click="MainStore.LayoutSpliter.toggle({}, false)"
        >Cancel</v-btn
      >
      <v-btn
        class="primary"
        :disabled="!isValid || !isFormChanged || !canEdit"
        @click="updateItem"
        >Update</v-btn
      >
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { TicketForm as Form } from '~/types/form.interface'

import TicketForm from '~/components/tickets/TicketForm.vue'
import { MainStore } from '~/store'
import TicketService from '~/services/ticket.service'
import { cloneDeep, isEqual } from 'lodash'

export default Vue.extend({
  components: {
    TicketForm,
  },
  props: {},
  watch: {
    itemId: {
      async handler() {
        if (this.itemId !== '') {
          await this.getItem()
        }
      },
    },
  },
  data: () => ({
    MainStore,
    isValid: false,
    uploadUrl: '',
    form: {
      name: '',
      summary: '',
      description: '',
      type_id: '',
      severity_id: '',
      priority_id: '',
    } as Form,
    formObject: (<Form>{}) as Form,
  }),
  computed: {
    isFormChanged(): boolean {
      return !isEqual(this.form, this.formObject)
    },
    itemId(): string {
      return MainStore.LayoutSpliter.getData().id
    },
    canEdit(): Boolean {
      if (
        MainStore.Auth.can([
          'edit-bugs',
          'edit-feature-requests',
          'edit-test-cases',
        ])
      )
        return true
      return false
    },
  },
  methods: {
    onFormValid(e: boolean) {
      this.isValid = e
    },
    async getItem() {
      try {
        let service = new TicketService()
        const response = await service.show(this.itemId)
        let { name, summary, description, type_id, severity_id, priority_id } =
          response.data
        const form: Form = {
          name,
          summary,
          description,
          type_id,
          severity_id,
          priority_id,
        }

        this.form = form
        setTimeout(() => {
          this.formObject = cloneDeep(this.form)
        }, 250)
      } catch (err: any) {
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: err.response.data.message,
          color: 'error',
        })
      }
    },

    async updateItem() {
      try {
        const {
          name,
          summary,
          description,
          type_id,
          severity_id,
          priority_id,
        } = this.form
        const requestBody = {
          name,
          summary,
          description,
          type_id,
          severity_id,
          priority_id,
        }
        let service = new TicketService()
        await service.update(this.itemId, requestBody)

        MainStore.Loading.toggleAlert({
          isOn: true,
          message: 'Success',
          color: 'success',
        })
        MainStore.LayoutSpliter.toggle({ emit: 'onUpdated' }, false)
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
    if (this.itemId !== '') {
      await this.getItem()
    }
  },
})
</script>

<style lang="scss" scoped>
.scrolling-div {
  overflow-y: auto;
  height: calc(100vh - 64px - 64px);
}

.scrolling-div-edited {
  overflow-y: auto;
  height: calc(100vh - 64px - 64px - 84px);
}
</style>
