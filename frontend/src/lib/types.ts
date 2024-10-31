export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  role: string
}

export interface ApiResponse<T> {
  data: T
  message: string
}
