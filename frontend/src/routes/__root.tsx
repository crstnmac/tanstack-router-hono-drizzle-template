import * as React from 'react'
import {Link, Outlet, createRootRouteWithContext} from '@tanstack/react-router'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
import {QueryClient} from '@tanstack/react-query'
import {AuthContext} from '@/hooks/useAuth'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  auth: AuthContext
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  },
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="top-right"
        position="right"
      />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
