import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/kolikkopelit")({
  loader: () => loadPage("kolikkopelit"),
  head: ({ loaderData }) => pageHead(loaderData, "Kolikkopelit"),
  component: () => <CmsPage slug="kolikkopelit" fallbackTitle="Kolikkopelit" />,
});
