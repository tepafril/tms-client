import { defineStore } from 'pinia'
import { LoadState } from '~/types/load.state.enum'
import { LooseObject } from '~/types/loose.object.interface'

export const useSpliterStore = defineStore({
  id: 'layoutSplitter',
  state: () => ({
    data: {} as LooseObject,
    isRevealed: false as any,
  }),
  persistence: false, // <=== to make sure that states are sync with localStorage. Check /plugins/persisted-state.ts for more detail
  getters: {},
  actions: {
    toggle(data: LooseObject, isRevealed: Boolean): void {
      this.data = data
      this.isRevealed = isRevealed
    },
    getData(): LooseObject {
      return this.data
    },
    isToggle(): Boolean {
      return this.isRevealed
    },
  },
})
