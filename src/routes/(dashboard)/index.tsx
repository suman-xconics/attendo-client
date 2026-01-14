import PageContentContainer from '@/components/layout/container/page-content'
import { useAuth } from '@/provider/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/')({
  component: () => {
    const {user, session} = useAuth()
    return (
      <PageContentContainer>
      <h1>Dashboard</h1>
      <p>Welcome to Home Dashboard</p>
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
    </PageContentContainer>
    )
  }
})
