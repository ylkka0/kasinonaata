import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/uutiset")({
  loader: () => loadPage("uutiset"),
  head: ({ loaderData }) => pageHead(loaderData, "Uutiset"),
  component: () => <CmsPage slug="uutiset" fallbackTitle="Uutiset" />,
});