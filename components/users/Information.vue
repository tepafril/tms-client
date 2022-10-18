<template>
  <div class="pa-8">
    <div class="mb-8">
      <p class="text-h6 mb-0 text1--text font-weight-medium">Information</p>
    </div>
    <v-form v-model="isValid" @submit.prevent>
      <div class="d-flex">
        <v-text-field
          dense
          height="48"
          label="Name"
          outlined
          class="mb-6"
          hide-details="auto"
          :rules="[rules.required]"
          v-model="form.name"
          :disabled="readOnly"
        ></v-text-field>
      </div>
      <div class="d-flex">
        <v-text-field
          dense
          height="48"
          label="Email"
          outlined
          class="mb-6"
          hide-details="auto"
          v-model="form.email"
          :disabled="true"
          v-if="formType === 'edit-user'"
        ></v-text-field>
        <v-text-field
          dense
          height="48"
          label="Email"
          outlined
          class="mb-6"
          hide-details="auto"
          :rules="[rules.required, rules.emailMatch]"
          v-model="form.email"
          :disabled="readOnly"
          v-else
        ></v-text-field>
      </div>
      <div class="d-flex" v-if="formType === 'edit-user'">
        <v-text-field
          dense
          height="48"
          label="Password"
          outlined
          class="mb-6 mr-6"
          hide-details="auto"
          v-model="form.password"
          :disabled="readOnly"
          type="password"
        ></v-text-field>
        <v-text-field
          dense
          height="48"
          label="Confirm Password"
          outlined
          class="mb-6"
          hide-details="auto"
          v-model="form.password_confirmation"
          :disabled="readOnly"
          :rules="[passwordConfirmationRule]"
          type="password"
        ></v-text-field>
      </div>
      <div class="d-flex" v-else>
        <v-text-field
          dense
          height="48"
          label="Password"
          outlined
          class="mb-6 mr-6"
          hide-details="auto"
          v-model="form.password"
          :disabled="readOnly"
          :rules="[rules.required]"
          type="password"
        ></v-text-field>
        <v-text-field
          dense
          height="48"
          label="Confirm Password"
          outlined
          class="mb-6"
          hide-details="auto"
          v-model="form.password_confirmation"
          :disabled="readOnly"
          :rules="[rules.required, passwordConfirmationRule]"
          type="password"
        ></v-text-field>
      </div>
      <div class="d-flex">
        <v-autocomplete
          dense
          height="48"
          class="mb-6"
          label="Role"
          outlined
          hide-details="auto"
          :items="roles"
          item-disabled="disable"
          :rules="[rules.required]"
          item-value="id"
          v-model="form.role_id"
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
import { rule } from 'postcss'
import Vue from 'vue'
import { User } from '~/models'
import UserService from '~/services/user.service'
import { MainStore } from '~/store'
import { TicketForm, UserForm } from '~/types/form.interface'

export default Vue.extend({
  components: {},
  props: {
    value: {
      default: <UserForm>{},
      type: Object as () => UserForm,
    },
    readOnly: {
      default: true,
      type: Boolean,
    },
    formType: {
      default: '',
      type: String,
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
    rules: {
      required: (v: string) => !!v || 'Input is required.',
      min: (v: string) => v.length >= 4 || 'Min 4 characters',
      emailMatch: (v: string) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(v) || 'Invalid e-mail.'
      },
    },
    form: {
      name: '',
      email: '',
      role_id: '',
      password: '',
      password_confirmation: '',
    } as UserForm,
    roles: [],
  }),
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.form.password === this.form.password_confirmation ||
        'Password must match'
    },
  },
  methods: {
    async getRoles() {
      try {
        let service = new UserService()
        const response = await service.roles()
        this.roles = response.data
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
    await this.getRoles()
    this.form = this.value
  },
})
</script>

<style style="scss" scoped></style>
