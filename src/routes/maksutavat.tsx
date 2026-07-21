import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { PaymentMethodsSection } from "@/components/home/PaymentMethodsSection";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/maksutavat")({
  loader: () => loadPage("maksutavat"),
  head: ({ loaderData }) => pageHead(loaderData, "Maksutavat"),
  component: MaksutavatPage,
});

function MaksutavatPage() {
  const { pathname } = useLocation();
  if (pathname !== "/maksutavat") return <Outlet />;
  return (
    <CmsPage slug="maksutavat" fallbackTitle="Maksutavat">
      <PaymentMethodsSection />
    </CmsPage>
  );
}
