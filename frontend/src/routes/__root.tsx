import * as React from 'react'

import {QueryClient} from '@tanstack/react-query'
import {createRootRouteWithContext, Outlet} from '@tanstack/react-router'
import {Toaster} from 'sonner'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

interface RouterContext {
  queryClient: QueryClient
}

const TanstackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      )

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
      <ReactQueryDevtools />
      <TanstackRouterDevtools position="top-right" />
    </>
  )
}
