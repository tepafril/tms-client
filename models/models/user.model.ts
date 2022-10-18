import { Expose } from 'class-transformer'

export default class User {
  @Expose({ name: 'id' })
  public id: string = ''

  @Expose({ name: 'name' })
  public name: string = ''
}
