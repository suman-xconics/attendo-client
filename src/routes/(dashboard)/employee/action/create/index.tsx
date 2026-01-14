import PageContentContainer from "@/components/layout/container/page-content";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/employee/action/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PageContentContainer>creaet form</PageContentContainer>;
}
