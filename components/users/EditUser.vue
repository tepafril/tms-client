<template>
  <v-card flat tile>
    <v-card
      flat
      tile
      dark
      class="d-flex accent py-4 px-8 accent justify-space-between"
    >
      <span class="font-weight-semibold text-h6 mb-0">User Detail</span>
      <v-icon @click="MainStore.LayoutSpliter.toggle({}, false)"
        >mdi-close</v-icon
      >
    </v-card>
    <div class="scrolling-div-edited">
      <user-form
        v-model="form"
        @valid="onFormValid"
        :readOnly="!canEdit"
        formType="edit-user"
      />
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
import { UserForm as Form } from '~/types/form.interface'

import UserForm from '~/components/users/UserForm.vue'
import { MainStore } from '~/store'
import UserService from '~/services/user.service'
import { cloneDeep, isEqual } from 'lodash'

export default Vue.extend({
  components: {
    UserForm,
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
    form: {
      name: '',
      email: '',
      role_id: '',
      password: '',
      password_confirmation: '',
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
      if (MainStore.Auth.can(['manage-users'])) return true
      return false
    },
  },
  methods: {
    onFormValid(e: boolean) {
      this.isValid = e
    },
    async getItem() {
      try {
        let service = new UserService()
        const response = await service.show(this.itemId)
        let { name, email, roles } = response.data
        const form: Form = {
          name,
          email,
          role_id: roles[0].id,
          password: '',
          password_confirmation: '',
        }

        this.form = form
        setTimeout(() => {
          this.formObject = cloneDeep(this.form)
        }, 250)
      } catch (err: any) {
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: err.response.data.data.message,
          color: 'error',
        })
      }
    },

    async updateItem() {
      try {
        const { name, email, role_id, password, password_confirmation } =
          this.form
        const requestBody = {
          name,
          email,
          role_id,
          password,
          password_confirmation,
        }
        let service = new UserService()
        const response = await service.update(this.itemId, requestBody)
        MainStore.Loading.toggleAlert({
          isOn: true,
          message: 'Success',
          color: 'success',
        })
        MainStore.LayoutSpliter.toggle({ emit: 'onUpdated' }, false)
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
