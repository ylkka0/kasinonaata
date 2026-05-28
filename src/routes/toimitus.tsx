import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/toimitus")({
  loader: () => loadPage("toimitus"),
  head: ({ loaderData }) => pageHead(loaderData, "Toimitus"),
  component: () => <CmsPage slug="toimitus" fallbackTitle="Toimitus" />,
});