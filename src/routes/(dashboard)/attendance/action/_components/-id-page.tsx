import PageContentContainer from "@/components/layout/container/page-content"
import ContentHeader from "@/components/layout/container/page-content-header"
import AttendanceForm from "./-form"

interface IdPageProps {
    id: string
}

export function IdPage({ id }: IdPageProps) {

    const newPage = id === "new"
    return (
        <PageContentContainer>
            <ContentHeader
                goBackButton
                title={newPage ? "Add Attendance" : `Attendance ID: ${id}`}
            />
            <AttendanceForm id={id} editMode={!newPage} />
        </PageContentContainer>
    )
}
