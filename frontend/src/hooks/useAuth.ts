import {api} from '@/lib/api'
import {redirect} from '@tanstack/react-router'
import {useState} from 'react'

export type TUser = {
  name: string
  email: string
  role: string
}

type AuthResponse = {
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
  message: string
}

export const useAuth = () => {
  const [user, setUser] = useState<TUser | null>(null)
  const isAuthenticated = user !== null
  const isLogged = async () => {
    const $checkAuth = api.auth['check-auth'].$get

    const res = await $checkAuth()

    const data: AuthResponse = await res.json()

    if (res.status === 200 && data.user) {
      setUser({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      })
      return true
    } else {
      console.error('User data is not available:', data.message)
      setUser(null)
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    isLogged,
  }
}

export type AuthContext = ReturnType<typeof useAuth>
