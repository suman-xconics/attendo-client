import { createFileRoute, useParams } from '@tanstack/react-router'
import { IdPage } from './_components/-id-page'

interface RouteParams {
  id: string
}

export const Route = createFileRoute('/(dashboard)/attendance/action/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/(dashboard)/attendance/action/$id' }) as RouteParams

  return (
      <IdPage id={id} />
  )
}
