import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/properties')({
  component: PropertiesIndex,
})

function PropertiesIndex() {
  return <div>Properties Index</div>
}
