import { MainStore } from '~/store'
import { LooseObject } from '~/types/loose.object.interface'
import Service from './service'

export default class TicketService extends Service {
  constructor() {
    super()
  }

  public async dashboard(): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/dashboard`
      return await MainStore.NuxtContext.getAxios().$get(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async index(params: LooseObject): Promise<LooseObject> {
    try {
      const { size, order, page, sort, search } = params
      const endpoint = `${this.getEndpoint()}/tickets/?size=${size}&page=${page}&s=${search}&order=${order}&sort=${sort}`
      return await MainStore.NuxtContext.getAxios().$get(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async show(id: string): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/tickets/${id}`
      return await MainStore.NuxtContext.getAxios().$get(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async create(body: LooseObject): Promise<void> {
    const endpoint = `${this.getEndpoint()}/tickets`
    return await MainStore.NuxtContext.getAxios().$post(endpoint, body)
  }

  public async update(id: string, body: LooseObject): Promise<void> {
    const endpoint = `${this.getEndpoint()}/tickets/${id}`
    return await MainStore.NuxtContext.getAxios().$put(endpoint, body)
  }

  public async destroy(id: string): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/tickets/${id}`
      return await MainStore.NuxtContext.getAxios().$delete(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async resolve(id: string): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/tickets/resolve/${id}`
      return await MainStore.NuxtContext.getAxios().$put(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async ticketTypes(): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/types`
      return await MainStore.NuxtContext.getAxios().$get(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async ticketLevels(): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/levels`
      return await MainStore.NuxtContext.getAxios().$get(endpoint)
    } catch (err: any) {
      return {}
    }
  }
}
