import ReactDOM from 'react-dom/client'
import {RouterProvider, createRouter} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {routeTree} from './routeTree.gen'
import './main.css'
import {Loader2Icon} from 'lucide-react'

const queryClient = new QueryClient()

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  // this will ensure loader is cancelled always when the route is preloaded or visited, since we are using react-query we don't want loader calls to ever be stale
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => (
    <div className="mx-auto mt-8 flex flex-col items-center justify-center">
      <Loader2Icon className="w-8 h-8 animate-spin" />
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  ),
  defaultErrorComponent: (err) => (
    <div className="mx-auto mt-8 flex flex-col items-center justify-center">
      <p className="text-red-500">{err.error.message}</p>
    </div>
  ),
  defaultNotFoundComponent: () => (
    <div className="mx-auto mt-8 flex flex-col items-center justify-center">
      <p className="text-red-500">404 Not Found</p>
    </div>
  ),
})

// Register things for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    // </React.StrictMode>
  )
}
