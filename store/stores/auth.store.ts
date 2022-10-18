import { defineStore } from 'pinia'
import { MainStore } from '~/store'
import { LooseObject } from '~/types/loose.object.interface'
import { instanceToPlain } from 'class-transformer'
import { isEmpty } from 'lodash'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // info: {} as LooseObject,
    errorMessage: '',
  }),
  persistence: false, // <=== to make sure that states are sync with localStorage. Check /plugins/persisted-state.ts for more detail
  getters: {
    // Encapsulation, is to make sure that "sensitive"
    // data is hidden from users.
    // get(state): any {
    //   return state.info
    // },
    getErrorMessage(state): any {
      return state.errorMessage
    },
  },
  actions: {
    async login(credential: LooseObject): Promise<void> {
      if (MainStore.NuxtContext.getAuth().loggedIn) return
      try {
        this.$patch({
          errorMessage: '',
        })

        MainStore.Loading.setPending()

        await MainStore.NuxtContext.getAuth().loginWith('laravelSanctum', {
          data: credential,
        })

        MainStore.Loading.setSuccess()
      } catch (err: any) {
        const response = err.response.data
        MainStore.Loading.setError()

        this.$patch({
          errorMessage: response.data.message,
        })
      }
    },
    clear(): void {
      this.errorMessage = ''
    },
    async logout() {
      await MainStore.NuxtContext.getAuth().logout()
      this.$patch({
        errorMessage: '',
      })
    },
    can(permissions: Array<string>): Boolean {
      if (!isEmpty(MainStore.NuxtContext.getAuth().user)) {
        const userPermissions = (
          MainStore.NuxtContext.getAuth().user as any
        ).permission.map((x: any) => x.name)

        return userPermissions.some((x: any) =>
          permissions.some((y: any) => x === y)
        )
      }
      return false
    },
    // we could do other stuff like redirecting the user
  },
})
