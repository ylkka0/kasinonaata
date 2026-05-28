import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/lisenssit")({
  loader: () => loadPage("lisenssit"),
  head: ({ loaderData }) => pageHead(loaderData, "Lisenssit"),
  component: () => <CmsPage slug="lisenssit" fallbackTitle="Lisenssit" />,
});