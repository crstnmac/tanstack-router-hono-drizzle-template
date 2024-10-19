import * as React from 'react'
import {createFileRoute, Navigate, redirect} from '@tanstack/react-router'
import {api} from '@/lib/api'
import {Button} from '@/components/ui/button'

export const Route = createFileRoute('/')({
  beforeLoad: async ({context}) => {
    const {isLogged} = context.auth

    const isUserLogged = await isLogged()

    if (!isUserLogged) {
      throw redirect({to: '/login'})
    }
  },
  component: HomeComponent,
})

function HomeComponent() {
  const $logout = api.auth.logout.$post

  const handleLogout = async () => {
    await $logout()
    window.location.reload()
  }

  return (
    <div>
      <h1>Home</h1>

      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}
