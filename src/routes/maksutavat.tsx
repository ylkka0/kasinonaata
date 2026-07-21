import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { PaymentMethodsSection } from "@/components/home/PaymentMethodsSection";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/maksutavat")({
  loader: () => loadPage("maksutavat"),
  head: ({ loaderData }) => pageHead(loaderData, "Maksutavat"),
  component: () => (
    <CmsPage slug="maksutavat" fallbackTitle="Maksutavat">
      <PaymentMethodsSection />
    </CmsPage>
  ),
});
