<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      floating
      class="neutral"
    >
      <v-list-item>
        <v-list-item-content class="py-2">
          <v-list-item-title class="d-flex justify-center align-center">
            <img alt="Youding" src="/img/logo.png" width="25%" />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          active-class="primary--text"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item exact @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="`Logout`" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app flat class="neutral">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
    </v-app-bar>
    <v-main class="gray5">
      <div class="d-flex flex-column">
        <div class="d-flex">
          <v-container class="mt-6">
            <Nuxt />
          </v-container>
          <v-slide-x-transition hide-on-leave leave-absolute>
            <div class="split-container white" v-if="isToggle">
              <edit-ticket v-if="dialogName === 'edit-ticket'" />
              <edit-user v-else-if="dialogName === 'edit-user'" />
            </div>
          </v-slide-x-transition>
        </div>
      </div>

      <v-snackbar
        v-model="snackbar"
        :multi-line="false"
        :color="MainStore.Loading.getAlert().color"
      >
        {{ MainStore.Loading.getAlert().message }}

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="MainStore.Loading.toggleAlert({ isOn: false })"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import EditTicket from '~/components/tickets/EditTicket.vue'
import EditUser from '~/components/users/EditUser.vue'
import { MainStore } from '~/store'
import { useSpliterStore } from '~/store/stores/spliter.store'
import { Tools } from '~/types/tools.func'
export default Vue.extend({
  name: 'DefaultLayout',
  auth: true,
  components: {
    EditTicket,
    EditUser,
  },
  watch: {},
  computed: {
    isToggle(): Boolean {
      return MainStore.LayoutSpliter.isToggle() === true
    },
    dialogName(): string {
      return MainStore.LayoutSpliter.getData().dialogName
    },
    snackbar: {
      get() {
        return MainStore.Loading.getAlert().isOn
      },
      set(newValue) {
        MainStore.Loading.toggleAlert({
          isOn: false,
          message: '',
          color: 'primary',
        })
      },
    },
  },
  data() {
    return {
      MainStore,
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-monitor-dashboard',
          title: 'Dashboard',
          to: '/dashboard',
        },
        {
          icon: 'mdi-ticket-outline',
          title: 'Tickets',
          to: '/tickets',
        },
        {
          icon: 'mdi-account',
          title: 'Users',
          to: '/users',
        },
      ],
      miniVariant: false,
      right: true,
    }
  },
  methods: {
    async logout(): Promise<void> {
      await MainStore.Auth.logout()
    },
  },
  async mounted() {},
})
</script>

<style lang="scss" scoped>
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
</style>
