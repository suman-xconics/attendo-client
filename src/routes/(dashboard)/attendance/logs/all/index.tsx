import PageContentContainer from '@/components/layout/container/page-content'
import ContentHeader from '@/components/layout/container/page-content-header'
import { useListEmployees } from '@/hooks/employee/query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import AttendanceTable from './_components/data-table'

export const Route = createFileRoute('/(dashboard)/attendance/logs/all/')({
  component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    const handleAddEmployee = () => {
        navigate({ to: '/attendance/action/new' })
    }
    return <PageContentContainer>
        <ContentHeader
            buttonText="Add Manual Entry"
            singleButton
            onAddClick={handleAddEmployee}
            title="All Attendance Logs"
        />
        <AttendanceTable />
    </PageContentContainer>
}
