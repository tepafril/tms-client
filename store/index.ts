import { useAuthStore } from '~/store/stores/auth.store'
import { LooseObject } from '~/types/loose.object.interface'
import { useNuxtContextStore } from './stores/nuxt.context.store'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime'
import { Auth } from '@nuxtjs/auth-next'
import { useLoadingStore } from './stores/loading.store'
import { LoadState } from '~/types/load.state.enum'
import { useSpliterStore } from './stores/spliter.store'

export const MainStore = {
  Auth: {
    async login(params: LooseObject): Promise<void> {
      await useAuthStore().login(params)
    },
    async logout(): Promise<void> {
      await useAuthStore().logout()
    },
    getErrorMessage(): any {
      return useAuthStore().getErrorMessage
    },
    clear(): any {
      return useAuthStore().clear()
    },
    can(permissions: Array<string>): Boolean {
      return useAuthStore().can(permissions)
    },
  },

  NuxtContext: {
    getAxios: function (): NuxtAxiosInstance {
      return useNuxtContextStore().getContext().$axios
    },
    getAuth: function (): Auth {
      return useNuxtContextStore().getContext().$auth
    },
    getConfig: function (): NuxtRuntimeConfig {
      return useNuxtContextStore().getContext().$config
    },
  },

  Loading: {
    setSuccess: function (): void {
      useLoadingStore().setSuccess()
    },
    setPending: function (): void {
      useLoadingStore().setPending()
    },
    setError: function (): void {
      useLoadingStore().setError()
    },
    getState: function (): LoadState {
      return useLoadingStore().getState()
    },
    getAlert: function (): LooseObject {
      return useLoadingStore().getAlert()
    },
    toggleAlert: function (toggle: LooseObject): void {
      return useLoadingStore().toggleAlert(toggle)
    },
  },

  LayoutSpliter: {
    toggle: function (data: LooseObject, isRevealed: Boolean): void {
      return useSpliterStore().toggle(data, isRevealed)
    },
    getData: function (): LooseObject {
      return useSpliterStore().getData()
    },
    isToggle: function (): Boolean {
      return useSpliterStore().isToggle()
    },
  },
}
