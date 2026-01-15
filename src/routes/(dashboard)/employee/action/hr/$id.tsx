import { createFileRoute, useParams } from '@tanstack/react-router'
import { IdPage } from './_components/-id-page'

interface RouteParams {
  id: string
}

export const Route = createFileRoute('/(dashboard)/employee/action/hr/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/(dashboard)/employee/action/hr/$id' }) as RouteParams

  return (
      <IdPage id={id} />
  )
}
