<template>
  <v-row>
    <v-col cols="12" md="6">
      <info-card
        title="All Tickets"
        :desc="allTickets"
        icon="mdi-ticket"
        color="warning"
      />
    </v-col>
    <v-col cols="12" md="6">
      <info-card title="Bugs" :desc="bugs" icon="mdi-bug" color="primary" />
    </v-col>
    <v-col cols="12" md="6">
      <info-card
        title="Test Cases"
        :desc="testCases"
        icon="mdi-file-document-multiple"
        color="green"
      />
    </v-col>
    <v-col cols="12" md="6">
      <info-card
        title="Feature Requests"
        :desc="requests"
        icon="mdi-replay"
        color="blue"
      ></info-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { isEmpty } from 'lodash'
import Vue from 'vue'
import InfoCard from '~/components/custom/InfoCard.vue'
import TicketService from '~/services/ticket.service'
import { MainStore } from '~/store'

export default Vue.extend({
  components: {
    InfoCard,
  },
  props: {},
  watch: {},
  data: () => ({
    isEmpty,
    allTickets: '0' as string,
    bugs: '0' as string,
    requests: '0' as string,
    testCases: '0' as string,
  }),
  computed: {},
  methods: {
    async getLists() {
      try {
        let service = new TicketService()
        const response = await service.dashboard()
        this.allTickets = response.data.all_tickets.toString()
        this.bugs = response.data.bugs.toString()
        this.requests = response.data.feature_requests.toString()
        this.testCases = response.data.test_cases.toString()
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
    console.log(':as')
    await this.getLists()
  },
})
</script>

<style></style>
