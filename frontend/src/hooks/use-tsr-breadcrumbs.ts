import {useLocation} from '@tanstack/react-router'

export function useTSRBreadCrumbs() {
  const current = useLocation()

  const route_history = current.pathname
    .split('/')
    .filter((x) => x && x.length > 0)

  const breadcrumb_routes = route_history.reduce(
    (acc: {name: string; path: string}[], route) => {
      const prev_path = acc[acc.length - 1]?.path ?? ''
      acc.push({name: route, path: `${prev_path}/${route}`})
      return acc
    },
    []
  )
  return {breadcrumb_routes}
}
