<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Ticket Management System</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pa-8">
                <v-form v-model="isValid">
                  <v-text-field
                    prepend-inner-icon="mdi-account"
                    name="login"
                    placeholder="Email"
                    type="email"
                    outlined
                    v-model="form.email"
                    :rules="[rules.required, rules.emailMatch]"
                  ></v-text-field>
                  <v-text-field
                    prepend-inner-icon="mdi-key"
                    name="password"
                    placeholder="Password"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    v-model="form.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :rules="[rules.required, rules.min]"
                  ></v-text-field>
                  <div class="error--text">{{ errorMessage }}</div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  x-large
                  block
                  color="primary"
                  to="/"
                  @click="login"
                  :loading="isPending"
                  :disabled="!isValid"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { MainStore } from '~/store'
import { LoadState } from '~/types/load.state.enum'
import { LooseObject } from '~/types/loose.object.interface'
export default Vue.extend({
  name: 'Login',
  auth: 'guest',
  layout: 'unauthenticated',
  props: {},
  data() {
    return {
      rules: {
        required: (v: string) => !!v || 'Input is required.',
        min: (v: string) => v.length >= 4 || 'Min 4 characters',
        emailMatch: (v: string) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(v) || 'Invalid e-mail.'
        },
      },
      showPassword: false as Boolean,
      isValid: false as Boolean,
      form: {
        email: '' as string,
        password: '' as string,
      } as LooseObject,
    }
  },
  computed: {
    isPending(): Boolean {
      return MainStore.Loading.getState() === LoadState.PENDING ? true : false
    },
    isSuccess(): Boolean {
      return MainStore.Loading.getState() === LoadState.SUCCESS ? true : false
    },
    errorMessage(): string {
      return MainStore.Auth.getErrorMessage()
    },
  },
  methods: {
    async login(): Promise<void> {
      const credential = {
        email: this.form.email,
        password: this.form.password,
      }
      await MainStore.Auth.login(credential)
      if (MainStore.Loading.getState() === LoadState.SUCCESS)
        this.$router.push('/dashboard')
    },
  },
  mounted() {
    MainStore.Auth.clear()
  },
})
</script>

<style></style>
