import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/bonukset")({
  loader: () => loadPage("bonukset"),
  head: ({ loaderData }) => pageHead(loaderData, "Bonukset"),
  component: () => <CmsPage slug="bonukset" fallbackTitle="Bonukset" />,
});
