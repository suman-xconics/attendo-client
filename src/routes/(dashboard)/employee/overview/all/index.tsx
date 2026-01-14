import PageContentContainer from '@/components/layout/container/page-content'
import ContentHeader from '@/components/layout/container/page-content-header'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/employee/overview/all/')({
  component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    const handleAddEmployee = () => {
        navigate({ to: '/employee/action/new' })
    }
    return <PageContentContainer>
        <ContentHeader
            buttonText="Add Employee"
            singleButton
            onAddClick={handleAddEmployee}
            title="All Employees"
        />
        table goes here
    </PageContentContainer>
}
