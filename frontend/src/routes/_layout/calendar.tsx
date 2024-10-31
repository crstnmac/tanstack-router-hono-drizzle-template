import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/calendar')({
  component: () => <div>Hello /_authed/calendar/!</div>,
})
