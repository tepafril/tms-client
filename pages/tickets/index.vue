<template>
  <v-card class="pa-6">
    <div class="d-flex mb-8 justify-space-between align-end">
      <v-text-field
        dense
        v-model="search"
        outlined
        class="mr-4 shrink"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        hide-details="auto"
        @keyup="searchItem"
      ></v-text-field>

      <add-ticket @onCreated="getLists()"></add-ticket>
    </div>
    <v-data-table
      class="text1--text"
      :headers="isToggle ? splitHeaders : headers"
      :page="page"
      :page-count="pageCount"
      :options.sync="options"
      :server-items-length="total"
      item-key="id"
      :items="items"
      :sort-desc.sync="sortDesc"
      :must-sort="true"
      @click:row="onRowClick"
    >
      <template v-slot:[`item.name`]="props">
        <div class="d-flex flex-column py-4">
          <p class="mb-1 font-weight-medium">
            {{ props.item.name }}
          </p>
        </div>
      </template>
      <template v-slot:[`item.issuer`]="props">
        <div class="d-flex flex-column py-4">
          <p class="mb-1 font-weight-medium">
            {{ props.item.issuer !== null ? props.item.issuer.name : 'N/A' }}
          </p>
        </div>
      </template>
      <template v-slot:[`item.resolver`]="props">
        <div class="d-flex flex-column py-4">
          <p class="mb-1 font-weight-medium">
            {{
              props.item.resolver !== null ? props.item.resolver.name : 'N/A'
            }}
          </p>
        </div>
      </template>
      <template v-slot:[`item.status`]="props">
        <div class="d-flex justify-center">
          <v-chip
            small
            :ripple="false"
            text-color="black"
            v-if="
              props.item.status !== null &&
              props.item.status.slug === 'resolved'
            "
          >
            {{ props.item.status !== null ? props.item.status.name : '' }}
          </v-chip>
          <v-chip
            small
            text-color="black"
            color="warning"
            :ripple="false"
            v-else
          >
            {{ props.item.status !== null ? props.item.status.name : '' }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.type`]="props">
        <div class="d-flex justify-center">
          <v-chip
            class="ma-2"
            color="blue"
            label
            small
            outlined
            text-color="blue"
            v-if="props.item.type.slug === 'feature-requests'"
          >
            <v-icon small left> mdi-replay </v-icon>
            {{ props.item.type !== null ? props.item.type.name : '' }}
          </v-chip>

          <v-chip
            class="ma-2"
            color="primary"
            label
            outlined
            small
            text-color="primary"
            v-if="props.item.type.slug === 'bugs'"
          >
            <v-icon small left> mdi-bug </v-icon>
            {{ props.item.type !== null ? props.item.type.name : '' }}
          </v-chip>
          <v-chip
            class="ma-2"
            color="green"
            label
            small
            outlined
            text-color="green"
            v-if="props.item.type.slug === 'test-cases'"
          >
            <v-icon small left> mdi-file-document-multiple </v-icon>
            {{ props.item.type !== null ? props.item.type.name : '' }}
          </v-chip>
        </div>
      </template>

      <template v-slot:[`item.severity`]="props">
        <div class="d-flex justify-center">
          {{ props.item.severity !== null ? props.item.severity.name : '' }}
        </div>
      </template>
      <template v-slot:[`item.priority`]="props">
        <div class="d-flex justify-center">
          {{ props.item.priority !== null ? props.item.priority.name : '' }}
        </div>
      </template>
      <template v-slot:[`item.action`]="props">
        <v-menu left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" @click.prevent
              >mdi-dots-vertical</v-icon
            >
          </template>
          <v-list min-width="162">
            <v-list-item
              @click="resolveItem(props.item)"
              :disabled="!props.item.canResolve"
            >
              <v-list-item-title> Resolve </v-list-item-title>
            </v-list-item>

            <v-list-item @click="onRowClick(props.item)">
              <v-list-item-title>View</v-list-item-title>
            </v-list-item>

            <v-list-item
              @click="deleteItem(props.item)"
              :disabled="!props.item.canDelete"
            >
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Options } from '~/types/options.interface'
import TicketService from '~/services/ticket.service'
import AddTicket from '~/components/tickets/AddTicket.vue'
import { MainStore } from '~/store'
import EditTicket from '~/components/tickets/EditTicket.vue'
import { isEmpty } from 'lodash'

export default Vue.extend({
  props: {},
  auth: true,
  watch: {
    options: {
      async handler() {
        await this.getLists()
      },
      deep: true,
    },
    isToggle: {
      async handler() {
        if (
          !isEmpty(MainStore.LayoutSpliter.getData().emit) &&
          MainStore.LayoutSpliter.getData().emit === 'onUpdated'
        )
          await this.getLists()
        //     MainStore.LayoutSpliter.toggle({ emit: '' }, false)
      },
    },
  },
  components: {
    AddTicket,
    EditTicket,
  },
  data: () => ({
    MainStore,
    sortDesc: false as Boolean,
    search: '',
    page: 1,
    pageCount: 0,
    total: 0,
    options: {} as Options,
    headers: [
      {
        text: '#ID',
        value: 'id',
        width: '40px',
        sortable: false,
        align: 'center',
      },
      { text: 'Title', value: 'name', sortable: false },
      { text: 'Issued By', value: 'issuer', sortable: false, align: 'center' },
      {
        text: 'Resolved By',
        value: 'resolver',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Status',
        value: 'status',
        width: '50px',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Ticket Type',
        value: 'type',
        width: '50px',
        sortable: false,
        align: 'center',
      },
      { text: 'Severity', value: 'severity', sortable: false, align: 'center' },
      { text: 'Priority', value: 'priority', sortable: false, align: 'center' },
      {
        text: 'Action',
        value: 'action',
        width: '40px',
        sortable: false,
        align: 'center',
      },
    ],
    splitHeaders: [
      {
        text: '#ID',
        value: 'id',
        width: '40px',
        sortable: false,
        align: 'center',
      },
      { text: 'Title', value: 'name', width: '200px', sortable: false },
      { text: 'Issued By', value: 'issuer', sortable: false, align: 'center' },
      {
        text: 'Ticket Type',
        value: 'type',
        sortable: false,
        align: 'center',
      },
    ],
    items: [],
    editDialog: false as Boolean,
  }),
  computed: {
    isToggle(): Boolean {
      return MainStore.LayoutSpliter.isToggle()
    },
    layoutName(): any {
      return MainStore.LayoutSpliter.getData().name
    },
  },
  methods: {
    onRowClick(item: any): void {
      MainStore.LayoutSpliter.toggle(
        { id: item.id, dialogName: 'edit-ticket' },
        true
      )
    },

    async searchItem(): Promise<void> {
      if (this.options.page !== 1) this.options.page = 1
      await this.getLists()
    },

    async getLists() {
      try {
        const { page, itemsPerPage } = this.options
        let body = {
          page: page,
          size: itemsPerPage,
          search: this.search,
          sort: 'id',
          order: 'desc',
        }
        let service = new TicketService()
        const response = await service.index(body)
        this.items = response.data.map((x: any) => {
          let canResolve = false
          let canDelete = MainStore.Auth.can(['delete-bugs'])

          if (MainStore.Auth.can(['resolve-bugs']) && x.type.slug === 'bugs')
            canResolve = true
          else if (
            MainStore.Auth.can(['resolve-feature-requests']) &&
            x.type.slug === 'feature-requests'
          )
            canResolve = true
          else if (
            MainStore.Auth.can(['resolve-test-cases']) &&
            x.type.slug === 'test-cases'
          )
            canResolve = true

          canResolve = canResolve && x.status.slug !== 'resolved'

          return { canResolve, canDelete, ...x }
        })
        this.total = response.total
        this.pageCount = response.last_page
      } catch (err: any) {
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: err.response.data.message,
          color: 'error',
        })
      }
    },

    async deleteItem(item: any) {
      try {
        let service = new TicketService()
        await service.destroy(item.id)
        await this.getLists()
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: 'Success',
          color: 'success',
        })
      } catch (err: any) {
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: err.response.data.message,
          color: 'error',
        })
      }
    },

    async resolveItem(item: any) {
      try {
        let service = new TicketService()
        await service.resolve(item.id)
        await this.getLists()
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: 'Success',
          color: 'success',
        })
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
    await this.getLists()
  },
})
</script>

<style lang="scss" scoped>
.cut-users-text {
  display: -webkit-box;
  height: 20px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.sub-datatable) {
  padding: 0px !important;

  thead {
    visibility: collapse;
  }

  tr td:first-child {
    padding-left: 9rem !important;
  }
}

:deep(.v-data-table
    > .v-data-table__wrapper
    tbody
    tr.v-data-table__expanded__content) {
  box-shadow: none;
}
.split-container {
  width: 100%;
  max-width: 720px;
  min-width: 492px;
  overflow-y: auto;
  height: calc(100vh - 64px);
  position: -webkit-sticky;
  position: sticky;
  top: 64px;
}
:deep(.v-text-field--outlined.v-input--dense .v-label) {
  top: 12px;
}
</style>
