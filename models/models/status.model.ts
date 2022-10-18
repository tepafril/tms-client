import { Expose } from 'class-transformer'

export default class TicketStatus {
  @Expose({ name: 'id' })
  public id: string = ''

  @Expose({ name: 'name' })
  public name: string = ''
}
