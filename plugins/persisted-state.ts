import { PiniaPluginContext } from 'pinia'
import { Plugin } from '@nuxt/types'

// Adding { persistence: boolean } as store options
declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persistence?: Boolean
  }
}

// State listener to sync data with local storage
const persistedStateListener = ({ options, store }: PiniaPluginContext) => {
  // This is only fired, when store persistence set to true
  if (options.persistence === undefined || options.persistence === false) return

  // Store id or store name that we defined in each store.
  const storeId = store.$id

  // Patch data if local storage is not empty
  const fromStorage = JSON.parse(window.localStorage.getItem(storeId) || '{}')
  if (fromStorage) store.$patch(fromStorage)

  // Listener to always set data when state changed.
  store.$subscribe((mutation, state) => {
    window.localStorage.setItem(storeId, JSON.stringify(state))
  })
}

// Telling nuxt to use pinia.use()
const persistedStatePlugin: Plugin = ({ $pinia }) => {
  $pinia.use(persistedStateListener)
}

export default persistedStatePlugin
