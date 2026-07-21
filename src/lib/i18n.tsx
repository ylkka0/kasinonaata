import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fi" | "en";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx>({ lang: "fi", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fi");

  useEffect(() => {
    document.documentElement.lang = "fi";
  }, []);

  const setLang = (_l: Lang) => {
    setLangState("fi");
    document.documentElement.lang = "fi";
  };

  useEffect(() => {
    try { document.documentElement.lang = lang; } catch {}
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Returns the EN value when language is EN and a non-empty EN value exists, otherwise FI. */
export function pick<T extends string | null | undefined>(lang: Lang, fi: T, en: T): T {
  return fi;
}

/** Array variant for text[] columns: returns EN array if non-empty, otherwise FI. */
export function pickArr<T>(lang: Lang, fi: T[] | null | undefined, en: T[] | null | undefined): T[] {
  return fi ?? [];
}

// ---- UI strings ----
type Dict = Record<string, { fi: string; en: string }>;
const STRINGS: Dict = {
  "lang.switch": { fi: "Kieli", en: "Language" },
  "lang.fi": { fi: "Suomeksi", en: "Finnish" },
  "lang.en": { fi: "Englanniksi", en: "English" },
  "common.home": { fi: "Etusivu", en: "Home" },
  "common.loading": { fi: "Ladataan…", en: "Loading…" },
  "common.backToTop": { fi: "Takaisin ylös", en: "Back to top" },
  "menu.open": { fi: "Avaa valikko", en: "Open menu" },
  "faq.title": { fi: "Usein kysytyt kysymykset", en: "Frequently asked questions" },
  "blog.crumb": { fi: "Blogi", en: "Blog" },
  "review.crumb": { fi: "Arvostelut", en: "Reviews" },
  "review.bonus": { fi: "🎁 Tervetuliaisbonus", en: "🎁 Welcome bonus" },
  "review.games": { fi: "🎰 Pelivalikoima", en: "🎰 Games" },
  "review.license": { fi: "Lisenssi", en: "License" },
  "review.payments": { fi: "Maksutavat", en: "Payment methods" },
  "review.withdrawals": { fi: "Kotiutukset", en: "Withdrawals" },
  "review.support": { fi: "Asiakaspalvelu", en: "Customer support" },
  "review.pros": { fi: "Plussat", en: "Pros" },
  "review.cons": { fi: "Miinukset", en: "Cons" },
  "review.notFound": { fi: "Arvostelua ei löytynyt", en: "Review not found" },
  "review.backToList": { fi: "← Takaisin arvosteluihin", en: "← Back to reviews" },
  "review.disclaimer": { fi: "18+ · Pelaa vastuullisesti · T&C voimassa", en: "18+ · Play responsibly · T&Cs apply" },
  // Hero
  "hero.kicker": { fi: "Kasinouutiset —", en: "Casino news —" },
  "hero.headline": { fi: "aina ajan tasalla", en: "always up to date" },
  "hero.lede": {
    fi: "Kasinonäätä seuraa nettikasinoiden maailmaa kellon ympäri. Uudet kasinot, bonusmuutokset, lisenssipäivitykset — saat kaiken täältä ensimmäisenä.",
    en: "Kasinonäätä follows the online casino world around the clock. New casinos, bonus changes, license updates — you'll get it all here first."
  },
  "hero.cta": { fi: "Lue uutiset →", en: "Read the news →" },
  // Top3
  "top3.kicker": { fi: "UUDET KASINOT", en: "NEW CASINOS" },
  "top3.top1": { fi: "Top 1", en: "Top 1" },
  "top3.defaultBonus": { fi: "Tervetulobonus uusille pelaajille", en: "Welcome bonus for new players" },
  "top3.playNow": { fi: "Pelaa nyt →", en: "Play now →" },
  "top3.readReview": { fi: "Lue arvio", en: "Read review" },
  "top3.prosCons": { fi: "Plussat & Miinukset", en: "Pros & Cons" },
  "top3.bonus": { fi: "Bonus", en: "Bonus" },
  "top3.terms": { fi: "18+ · Vain uusille pelaajille · T&C voimassa · Pelaa vastuullisesti", en: "18+ · New players only · T&Cs apply · Play responsibly" },
  // News feed
  "news.kicker": { fi: "Näädän toimitus", en: "Náátä editorial" },
  "news.title": { fi: "Uusimmat uutiset", en: "Latest news" },
  "news.all": { fi: "Kaikki →", en: "View all →" },
  "news.empty": { fi: "Ei vielä uutisia.", en: "No news yet." },
  // Responsible gaming bar
  "rg.badge": { fi: "🛡️ 18+", en: "🛡️ 18+" },
  "rg.text": { fi: "Pelaa vastuullisesti. Rahapelaaminen voi aiheuttaa riippuvuutta.", en: "Play responsibly. Gambling can be addictive." },
  "rg.help": { fi: "Apua saat:", en: "Get help:" },
  // Footer
  "footer.responsible": { fi: "Vastuullisesti", en: "Responsibly" },
  "footer.adultsOnly": { fi: "Vain täysi-ikäisille", en: "Adults only" },
};

export function useT() {
  const { lang } = useLang();
  return (key: keyof typeof STRINGS | string, fallback?: string) => {
    const e = STRINGS[key as keyof typeof STRINGS];
    if (!e) return fallback ?? String(key);
    return e[lang];
  };
}
