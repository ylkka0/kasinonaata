import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/oppaat")({
  loader: () => loadPage("oppaat"),
  head: ({ loaderData }) => pageHead(loaderData, "Oppaat"),
  component: () => <CmsPage slug="oppaat" fallbackTitle="Oppaat" />,
});