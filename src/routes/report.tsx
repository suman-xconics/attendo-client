import PageContentContainer from '@/components/layout/container/page-content'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/report')({
  component: () => (
      <PageContentContainer>
      <h1>Reports</h1>
    </PageContentContainer>
  ),
})
