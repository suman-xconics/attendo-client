import PageContentContainer from "@/components/layout/container/page-content"
import ContentHeader from "@/components/layout/container/page-content-header"
import EmployeeForm from "./-form"

interface IdPageProps {
    id: string
}

export function IdPage({ id }: IdPageProps) {

    const newPage = id === "new"
    return (
        <PageContentContainer>
            <ContentHeader
                goBackButton
                title={newPage ? "Add New Hr Account" : `Hr Account ID: ${id}`}
            />
            <EmployeeForm id={id} editMode={!newPage} />
        </PageContentContainer>
    )
}
