import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/uutiset")({
  loader: () => loadPage("uutiset"),
  head: ({ loaderData }) => pageHead(loaderData, "Uutiset"),
  component: UutisetPage,
});

function UutisetPage() {
  const { pathname } = useLocation();
  if (pathname !== "/uutiset") return <Outlet />;
  return <CmsPage slug="uutiset" fallbackTitle="Uutiset" />;
}
