import { defineStore } from 'pinia'
import { LoadState } from '~/types/load.state.enum'
import { LooseObject } from '~/types/loose.object.interface'

export const useLoadingStore = defineStore({
  id: 'loading',
  state: () => ({
    loadingState: LoadState.SUCCESS as LoadState,
    alert: { isOn: false, message: '', color: 'primary' } as LooseObject,
  }),
  getters: {},
  actions: {
    delay(t: number) {
      return new Promise((r) => setTimeout(r, t))
    },
    setSuccess(): void {
      this.loadingState = LoadState.SUCCESS
    },
    setPending(): void {
      this.loadingState = LoadState.PENDING
    },
    setError(): void {
      this.loadingState = LoadState.ERROR
    },
    getState(): LoadState {
      return this.loadingState
    },
    getAlert(): LooseObject {
      return this.alert
    },
    toggleAlert(toggle: LooseObject): void {
      this.alert = toggle
    },
  },
})
