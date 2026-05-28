import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/kotiutusnopeus")({
  loader: () => loadPage("kotiutusnopeus"),
  head: ({ loaderData }) => pageHead(loaderData, "Kotiutusnopeus"),
  component: () => <CmsPage slug="kotiutusnopeus" fallbackTitle="Kotiutusnopeus" />,
});
