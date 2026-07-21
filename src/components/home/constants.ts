export const MONTHS_FI = [
  "Tammikuu","Helmikuu","Maaliskuu","Huhtikuu","Toukokuu","Kesäkuu",
  "Heinäkuu","Elokuu","Syyskuu","Lokakuu","Marraskuu","Joulukuu",
] as const;

const _NOW = new Date();
export const CURRENT_MONTH = MONTHS_FI[_NOW.getMonth()];
export const CURRENT_YEAR = _NOW.getFullYear();
export const UPDATED_DATE_SHORT = "10.5.2026";
export const UPDATED_DATE_LONG = "10. toukokuuta 2026";

export const FILTERS = [
  { id: "all", label: "🏆 Parhaat" },
  { id: "Pikakasino", label: "⚡ Pikakasinot" },
  { id: "Uudet", label: "🆕 Uudet 2026" },
  { id: "Verovapaa", label: "💰 Verovapaat" },
  { id: "Ilmaiskierrokset", label: "🎁 Ilmaiskierrokset" },
  { id: "Cashback", label: "💸 Cashback" },
  { id: "MGA", label: "🔒 MGA-lisenssi" },
] as const;

export const CATEGORY_CARDS = [
  { icon: "⚡", title: "Pikakasinot", sub: "Ei rekisteröitymistä", count: "23 kasinoa", to: "/pikakasinot" },
  { icon: "🆕", title: "Uudet kasinot", sub: `${CURRENT_YEAR}`, count: "18 uutta", to: "/kasinot" },
  { icon: "💰", title: "Verovapaat kasinot", sub: "MGA & EMTA", count: "31 kasinoa", to: "/kasinot" },
  { icon: "🎁", title: "Ilmaiskierrokset", sub: "Ilman talletusta", count: "15 kasinoa", to: "/bonukset" },
  { icon: "💸", title: "Cashback kasinot", sub: "Tappiot takaisin", count: "27 kasinoa", to: "/bonukset" },
  { icon: "🎰", title: "Korkea RTP", sub: "Kolikkopelit", count: "Pelit", to: "/kolikkopelit" },
] as const;

export const PAYMENT_METHODS = [
  { name: "Trustly", slug: "trustly", count: "23 kasinoa" },
  { name: "Zimpler", slug: "zimpler", count: "19 kasinoa" },
  { name: "Brite", slug: "brite", count: "17 kasinoa" },
  { name: "Viljo", slug: "viljo", count: "12 kasinoa" },
  { name: "Euteller", slug: "euteller", count: "8 kasinoa" },
  { name: "Trumo", slug: "trumo", count: "6 kasinoa" },
  { name: "Visa", slug: "visa", count: "25 kasinoa" },
  { name: "Krypto", slug: "krypto", count: "9 kasinoa" },
] as const;

export const FAQ = [
  { q: `Mitkä ovat parhaat nettikasinot ${CURRENT_YEAR}?`, a: `Parhaat nettikasinot ${CURRENT_YEAR} ovat ne joilla on MGA tai Viron EMTA -lisenssi, nopeat kotiutukset ja selkeät bonusehdot. KasinoNäätä suosittelee erityisesti pikakasinoita joissa ei tarvita rekisteröitymistä.` },
  { q: "Mitkä kasinot ovat verovapaita suomalaisille?", a: "Suomalaisille verovapaat voitot tulevat kasinoilta joilla on MGA (Malta) tai EMTA (Viro) -lisenssi. Curacaon lisenssin kasinot eivät ole verovapaita." },
  { q: "Mitä tarkoittaa pikakasino tai kasino ilman rekisteröitymistä?", a: "Pikakasinolla eli Pay N Play -kasinolla tunnistautuminen tapahtuu suoraan pankkitunnuksilla talletuksen yhteydessä. Erillistä rekisteröitymistä ei tarvita ja pelaaminen alkaa heti talletuksen jälkeen." },
  { q: "Kuinka nopeasti kasinolta saa rahat tilille?", a: "Nopeimmilla pikakasinoilla kotiutus vie 1-15 minuuttia Trustlyn, Briten, Viljon tai Zimplerin kautta. Perinteiset kasinot voivat kestää 1-3 päivää." },
  { q: "Mikä on kierrätysvaatimus ja miten se lasketaan?", a: "Kierrätysvaatimus tarkoittaa kuinka monta kertaa bonussumma täytyy pelata ennen kuin voit kotiuttaa voitot. Esimerkiksi 100€ bonus ja 35x kierrätys tarkoittaa että sinun täytyy pelata 3500€ ennen kotiuttamista." },
  { q: "Voiko nettikasinoilla voittaa oikeaa rahaa?", a: "Kyllä voi. Nettikasinoilla voi voittaa oikeaa rahaa, mutta kasinolla on aina matemaattinen etu. Pitkällä tähtäimellä kasino voittaa. Pelaa kohtuullisilla summilla ja aseta itsellesi häviöraja." },
  { q: "Onko nettikasinoilla pelaaminen laillista Suomessa?", a: "Kyllä. Suomalaiset voivat vapaasti pelata ulkomaisilla nettikasinoilla. Vain markkinointi Suomessa on rajoitettua. Vuodesta 2027 alkaen myös Suomen-lisenssin kasinot tulevat markkinoille." },
];

export const TOC = [
  { id: "top10", label: `TOP 10 parhaat nettikasinot ${CURRENT_YEAR}` },
  { id: "kategoriat", label: "Etsi kasino tarpeidesi mukaan" },
  { id: "bonukset", label: "Kuukauden parhaat bonukset" },
  { id: "maksutavat", label: "Suosituimmat maksutavat" },
  { id: "seo", label: "Täydellinen kasinoasiantuntijan opas" },
  { id: "lisenssit", label: "Kasinon lisenssi — miksi tärkeä?" },
  { id: "faq", label: "Usein kysyttyä" },
];
