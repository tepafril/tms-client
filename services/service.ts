import { MainStore } from '~/store'

export default class Service {
  public getEndpoint(): string {
    return MainStore.NuxtContext.getConfig().API_ENDPOINT
  }
}
