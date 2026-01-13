import PageContentContainer from '@/components/layout/container/page-content'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <PageContentContainer>
      <h1>Dashboard</h1>
      <p>Welcome to Home Dashboard</p>
    </PageContentContainer>
  ),
})
