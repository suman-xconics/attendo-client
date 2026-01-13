import PageContentContainer from '@/components/layout/container/page-content'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/action/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PageContentContainer>Hello "/employee/action/create"!</PageContentContainer>
}
