import { Header } from "./Header";
import { Footer } from "./Footer";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <AffiliateDisclosure />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
