import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/clients')({
  component: () => <div>Hello /_authed/clients/!</div>,
})
