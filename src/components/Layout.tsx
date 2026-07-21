import { Header } from "./Header";
import { Footer } from "./Footer";
import { AffiliateDisclosure } from "./AffiliateDisclosure";
import { FaqSection } from "./FaqSection";

export function Layout({ children, showFaq = false }: { children: React.ReactNode; showFaq?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <AffiliateDisclosure />
      <main className="flex-1">{children}</main>
      {showFaq && <FaqSection />}
      <Footer />
    </div>
  );
}
