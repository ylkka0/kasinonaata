import { createFileRoute, notFound } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { PAYMENT_METHODS } from "@/components/home/constants";
import { loadPage, pageHead } from "@/lib/cms";

export const Route = createFileRoute("/maksutavat/$slug")({
  loader: async ({ params }) => {
    const method = PAYMENT_METHODS.find((item) => item.slug === params.slug);
    if (!method) throw notFound();
    return loadPage(`maksutapa-${method.slug}`);
  },
  head: ({ params, loaderData }) => {
    const method = PAYMENT_METHODS.find((item) => item.slug === params.slug);
    return pageHead(loaderData, method ? `${method.name}-kasinot` : "Maksutapa");
  },
  component: PaymentMethodPage,
});

function PaymentMethodPage() {
  const { slug } = Route.useParams();
  const method = PAYMENT_METHODS.find((item) => item.slug === slug);
  if (!method) throw notFound();
  return <CmsPage slug={`maksutapa-${method.slug}`} fallbackTitle={`${method.name}-kasinot`} breadcrumb={`Maksutavat / ${method.name}`} />;
}
