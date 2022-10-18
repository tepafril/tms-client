import { MainStore } from '~/store'
import { LooseObject } from '~/types/loose.object.interface'
import Service from './service'

export default class UserService extends Service {
  constructor() {
    super()
  }

  public async index(params: LooseObject): Promise<LooseObject> {
    try {
      const { size, order, page, sort, search } = params
      const endpoint = `${this.getEndpoint()}/users/?size=${size}&page=${page}&s=${search}&order=${order}&sort=${sort}`
      return await MainStore.NuxtContext.getAxios().$get(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async show(id: string): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/users/${id}`
      return await MainStore.NuxtContext.getAxios().$get(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async create(body: LooseObject): Promise<void> {
    const endpoint = `${this.getEndpoint()}/users`
    return await MainStore.NuxtContext.getAxios().$post(endpoint, body)
  }

  public async update(id: string, body: LooseObject): Promise<void> {
    const endpoint = `${this.getEndpoint()}/users/${id}`
    return await MainStore.NuxtContext.getAxios().$put(endpoint, body)
  }

  public async destroy(id: string): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/users/${id}`
      return await MainStore.NuxtContext.getAxios().$delete(endpoint)
    } catch (err: any) {
      return {}
    }
  }

  public async roles(): Promise<LooseObject> {
    try {
      const endpoint = `${this.getEndpoint()}/roles`
      return await MainStore.NuxtContext.getAxios().$get(endpoint)
    } catch (err: any) {
      return {}
    }
  }
}
