<template>
  <v-dialog
    v-model="onClick"
    origin="center right"
    width="720"
    content-class="ma-0"
    transition="slide-x-reverse-transition"
    scrollable
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="primary" v-bind="attrs" v-on="on" :disabled="!canCreate">
        <v-icon left>mdi-plus</v-icon>
        User
      </v-btn>
    </template>
    <v-card flat tile>
      <v-card
        dark
        class="accent py-4 px-8 d-flex justify-space-between"
        flat
        tile
      >
        <p class="font-weight-semibold text-h6 mb-0">Create User</p>
        <v-icon @click="onClick = false">mdi-close</v-icon>
      </v-card>
      <div class="scrolling-div">
        <div id="scrollHere"></div>
        <user-form v-model="form" @valid="onValid" :readOnly="!canCreate" />
      </div>
      <div class="d-flex py-6 px-8">
        <v-spacer></v-spacer>
        <v-btn class="text1--text mr-4" text @click="onClick = false"
          >Cancel</v-btn
        >
        <v-btn class="primary" :disabled="!isValid" @click="createTicket"
          >Create</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { UserForm as Form } from '~/types/form.interface'

import UserForm from '~/components/users/UserForm.vue'
import { MainStore } from '~/store'
import UserService from '~/services/user.service'

export default Vue.extend({
  components: {
    UserForm,
  },
  props: {},
  watch: {
    onClick: {
      handler() {
        if (!this.onClick) {
          document.getElementById('scrollHere')?.scrollIntoView()
          this.form = {
            name: '',
            email: '',
            role_id: '',
            password: '',
            password_confirmation: '',
          }
        }
      },
    },
  },
  data: () => ({
    onClick: false,
    isValid: false,
    form: {
      name: '',
      email: '',
      role_id: '',
      password: '',
      password_confirmation: '',
    } as Form,
  }),
  computed: {
    requestBody(): any {
      const { name, email, password, password_confirmation, role_id } =
        this.form
      return { name, email, password, password_confirmation, role_id }
    },
    canCreate(): Boolean {
      if (MainStore.Auth.can(['manage-users'])) return true
      return false
    },
  },
  methods: {
    onValid(e: boolean) {
      this.isValid = e
    },

    async createTicket() {
      try {
        let service = new UserService()

        const response = await service.create(this.requestBody)

        MainStore.Loading.toggleAlert({
          isOn: true,
          message: 'Success',
          color: 'success',
        })

        this.$emit('onCreated', response)
        this.onClick = false
      } catch (err: any) {
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: err.response.data.data.message,
          color: 'error',
        })
      }
    },
  },
  mounted() {},
})
</script>

<style style="scss" scoped>
.scrolling-div {
  overflow-y: auto;
  height: calc(100vh - 64px - 84px);
}
:deep(.v-dialog) {
  max-height: none !important;
  border-radius: 0px;
  /* // add more */
  position: absolute;
  top: 0;
  right: 0;
}
</style>
