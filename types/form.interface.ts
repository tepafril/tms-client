export interface TicketForm {
  name: string
  summary: string
  description: string
  type_id: string
  severity_id: string
  priority_id: string
}

export interface UserForm {
  name: string
  email: string
  password: string
  password_confirmation: string
  role_id: string
}
