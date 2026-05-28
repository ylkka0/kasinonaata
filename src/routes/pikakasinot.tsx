import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/pikakasinot")({
  loader: () => loadPage("pikakasinot"),
  head: ({ loaderData }) => pageHead(loaderData, "Pikakasinot"),
  component: () => <CmsPage slug="pikakasinot" fallbackTitle="Pikakasinot" />,
});
