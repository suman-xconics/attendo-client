import PageContentContainer from '@/components/layout/container/page-content'
import { useAuth } from '@/provider/auth'
import { createFileRoute } from '@tanstack/react-router'
import AttendanceTable from './attendance/logs/all/_components/data-table'

export const Route = createFileRoute('/(dashboard)/')({
  component: () => {
    return (
      <PageContentContainer>
        <AttendanceTable />
    </PageContentContainer>
    )
  }
})
