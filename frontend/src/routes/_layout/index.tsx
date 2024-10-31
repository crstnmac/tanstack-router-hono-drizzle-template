import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="p-8 min-h-screen rounded-xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
    </div>
  )
}
