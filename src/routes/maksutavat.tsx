import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/maksutavat")({
  loader: () => loadPage("maksutavat"),
  head: ({ loaderData }) => pageHead(loaderData, "Maksutavat"),
  component: () => <CmsPage slug="maksutavat" fallbackTitle="Maksutavat" />,
});
