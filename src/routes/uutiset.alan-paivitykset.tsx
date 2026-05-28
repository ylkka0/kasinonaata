import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/uutiset/alan-paivitykset")({
  loader: () => loadPage("uutiset-alan-paivitykset"),
  head: ({ loaderData }) => pageHead(loaderData, "Alan päivitykset"),
  component: () => (
    <CmsPage slug="uutiset-alan-paivitykset" fallbackTitle="Alan päivitykset" breadcrumb="Uutiset / Alan päivitykset" />
  ),
});