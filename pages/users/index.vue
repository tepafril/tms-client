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

      <add-user @onCreated="getLists()"></add-user>
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
      <template v-slot:[`item.email`]="props">
        <div class="d-flex flex-column py-4">
          <p class="mb-1 font-weight-medium">
            {{ props.item.email }}
          </p>
        </div>
      </template>
      <template v-slot:[`item.roles`]="props">
        <v-chip
          v-for="role in props.item.roles"
          small
          :ripple="false"
          text-color="black"
          :key="role.id"
        >
          {{ role.name }}
        </v-chip>
      </template>

      <template v-slot:[`item.action`]="props">
        <v-menu left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" @click.prevent
              >mdi-dots-vertical</v-icon
            >
          </template>
          <v-list min-width="162">
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
import UserService from '~/services/user.service'
import AddUser from '~/components/users/AddUser.vue'
import { MainStore } from '~/store'
import EditUser from '~/components/users/EditUser.vue'
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
    AddUser,
    EditUser,
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
      { text: 'Name', value: 'name', sortable: false },
      { text: 'Email', value: 'email', sortable: false },
      {
        text: 'Roles',
        value: 'roles',
        sortable: false,
        align: 'center',
      },
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
      { text: 'Email', value: 'email', sortable: false },
      {
        text: 'Roles',
        value: 'roles',
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
        { id: item.id, dialogName: 'edit-user' },
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
        let service = new UserService()
        const response = await service.index(body)
        this.items = response.data.map((x: any) => {
          let canDelete = MainStore.Auth.can(['manage-users'])
          return { canDelete, ...x }
        })
        this.total = response.total
        this.pageCount = response.last_page
      } catch (err: any) {
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: err.response.data.data.message,
          color: 'error',
        })
      }
    },

    async deleteItem(item: any) {
      try {
        let service = new UserService()
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
          message: err.response.data.data.message,
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
