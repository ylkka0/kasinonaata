import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { LangProvider } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-gold">404</h1>
        <h2 className="mt-2 text-xl">Sivua ei löytynyt</h2>
        <p className="mt-2 text-sm text-muted-foreground">Näätä etsi mutta ei löytänyt mitään.</p>
        <Link to="/" className="inline-block mt-6 px-4 py-2 bg-[color:var(--gold)] text-background rounded-md font-bold uppercase tracking-wider text-sm">Etusivulle</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Jokin meni pieleen</h1>
        <p className="mt-2 text-sm text-muted-foreground">Yritä uudestaan tai palaa etusivulle.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="px-4 py-2 bg-[color:var(--gold)] text-background rounded-md font-bold text-sm uppercase tracking-wider">Yritä uudestaan</button>
          <a href="/" className="px-4 py-2 border border-[color:var(--gold)]/40 rounded-md text-sm uppercase tracking-wider">Etusivu</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kasinonäätä – Suomen rehellisin kasinoarviointi" },
      { name: "description", content: "Näätä tietää — sinä voitat. TOP 10 -listat, parhaat bonukset ja rehelliset kasinoarviot suomalaisille pelaajille." },
      { name: "author", content: "Kasinonäätä" },
      { property: "og:title", content: "Kasinonäätä – Suomen rehellisin kasinoarviointi" },
      { property: "og:description", content: "Näätä tietää — sinä voitat. TOP 10 -listat, parhaat bonukset ja rehelliset kasinoarviot suomalaisille pelaajille." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fi_FI" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kasinonäätä – Suomen rehellisin kasinoarviointi" },
      { name: "twitter:description", content: "Näätä tietää — sinä voitat. TOP 10 -listat, parhaat bonukset ja rehelliset kasinoarviot suomalaisille pelaajille." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/186384f3-4efb-4b0b-90f9-0d842d866443/id-preview-d4dee66a--35996a91-dd0d-4d53-9956-c2e206632411.lovable.app-1778484706116.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/186384f3-4efb-4b0b-90f9-0d842d866443/id-preview-d4dee66a--35996a91-dd0d-4d53-9956-c2e206632411.lovable.app-1778484706116.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const MAINTENANCE_MODE = true;

function RootComponent() {
  if (MAINTENANCE_MODE) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-4xl">Huoltotila</h1>
          <p className="mt-4 text-muted-foreground">
            Kasinonäätä on tilapäisesti pois käytöstä.
          </p>
        </div>
      </div>
    );
  }

  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <Outlet />
        <Toaster />
      </LangProvider>
    </QueryClientProvider>
  );
}