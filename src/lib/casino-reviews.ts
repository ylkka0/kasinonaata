export type CasinoReview = {
  slug: string;
  name: string;
  title: string;
  license: string;
  licenseFlag: string;
  licenseTaxNote?: string;
  paymentMethods: string;
  welcomeBonus: string;
  games: string;
  withdrawals: string;
  support: string;
  extras?: { title: string; content: string }[];
  pros: string[];
  cons: string[];
};

export const REVIEWS: Record<string, CasinoReview> = {
  pelikaani: {
    slug: "pelikaani",
    name: "Pelikaani",
    title: "Pelikaani.com Arvostelu: Uusi Pikakasino Suomalaiseen Makuun",
    license: "EMTA (Viro), lisenssinumero HKT000088",
    licenseFlag: "🇪🇪",
    paymentMethods: "Viljo (Pay N Play)",
    welcomeBonus:
      "1 pyöräytys Turbiiniin — voit voittaa jopa 1000+ ilmaiskierrosta tai bonusrahaa. Ei kierrätysvaatimusta, minimitalletus 20€.",
    games:
      "4000+ peliä — NetEnt, Microgaming, Play'n GO, Pragmatic Play, Nolimit City, Evolution Gaming ym.",
    withdrawals: "Alle 15 minuuttia",
    support:
      "Live-chat ma–pe 8–24, la–su 10–22, sähköposti support@pelikaani.com",
    pros: [
      "Ei kierrätysvaatimusta bonukselle",
      "Verovapaat voitot",
      "Nopeat kotiutukset",
      "Suomenkielinen",
    ],
    cons: ["Vain Viljo maksutapana"],
  },
  spinnaus: {
    slug: "spinnaus",
    name: "Spinnaus",
    title: "Spinnaus Casino Arvostelu 2026 — Nopein Pikakasino Suomalaiselle",
    license: "Curaçao",
    licenseFlag: "🇨🇼",
    licenseTaxNote:
      "Huom: Curaçao-lisensoiduilla kasinoilla voitot ovat verotettavia suomalaisille pelaajille.",
    paymentMethods: "Trustly, Brite, Zimpler Go (Pay N Play), minimitalletus 20€",
    welcomeBonus:
      "200 ilmaiskierrosta (40/pv x 5 päivää), 35x kierrätysvaatimus",
    games:
      "NetEnt, Play'n GO, Pragmatic Play, Nolimit City, BTG, Evolution Gaming",
    withdrawals: "Minuuteissa",
    support: "Live-chat klo 09–01, sähköposti support@spinnaus.com",
    extras: [
      {
        title: "Cashback",
        content:
          "10% päivittäinen, kierrätysvapaa, maksetaan automaattisesti seuraavana päivänä",
      },
      {
        title: "Spinneri-tasojärjestelmä",
        content:
          "Palkitsee ilmaiskierroksilla juuri siihen peliin jota pelaat eniten, samalla panostasolla",
      },
    ],
    pros: [
      "Kierrätysvapaa cashback",
      "Henkilökohtainen Spinneri-järjestelmä",
      "Non-sticky bonukset",
    ],
    cons: [
      "Englanninkielinen asiakaspalvelu",
      "Curaçao-lisenssi (voitot verotettavia)",
    ],
  },
  suomikasino: {
    slug: "suomikasino",
    name: "Suomikasino",
    title: "Suomikasino Arvostelu — Suomalaisten Luottokasino Vuodesta 2013",
    license: "MGA",
    licenseFlag: "🇲🇹",
    paymentMethods: "Trustly, Zimpler, Visa, Mastercard, Paysafe, Tilisiirto",
    welcomeBonus:
      "100% bonus 300€ asti + 120 kierrätysvapaat ilmaiskierrosta (40 Starburst, 40 Gonzo's Quest, 40 Twin Spin). Kierrätysvaatimus 35x.",
    games:
      "700+ peliä — NetEnt, Microgaming, Play'n GO, Evolution Gaming, Nolimit City, Yggdrasil ym.",
    withdrawals: "24h sisällä",
    support: "Live-chat 09–23, suomenkielinen",
    extras: [
      {
        title: "Oma kauppa",
        content:
          "Kerää pisteitä pelatessa ja vaihda bonuksiin, ilmaiskierroksiin tai käteiseen",
      },
    ],
    pros: [
      "Luotettava konkari vuodesta 2013",
      "Kierrätysvapaat ilmaiskierrokset",
      "Oma kauppa",
      "Suomenkielinen",
    ],
    cons: ["Suppeampi pelivalikoima", "Maksutapoja voisi olla enemmän"],
  },
  tuplaus: {
    slug: "tuplaus",
    name: "Tuplaus",
    title: "Tuplaus Casino Arvostelu 2026 — Moderni Suomalaisten Suosikki",
    license: "MGA",
    licenseFlag: "🇲🇹",
    paymentMethods:
      "Trustly, Brite, Visa, Mastercard, Skrill, Neteller, MuchBetter. Minimitalletus 10€.",
    welcomeBonus:
      "100% bonus + 100 ilmaiskierrosta, 35x kierrätys, voimassa 30 päivää, max panos 5€",
    games:
      "1000+ peliä — NetEnt, Yggdrasil, Play'n GO, Pragmatic Play, Nolimit City, Evolution",
    withdrawals: "Trustly/Brite minuuteissa, kortit 1–3 arkipäivää",
    support: "Live-chat 24/7 suomeksi, sähköposti",
    extras: [
      { title: "Cashback", content: "10–20% viikoittainen, kierrätysvapaa" },
      {
        title: "VIP-ohjelma",
        content:
          "Henkilökohtaiset palkinnot, eksklusiiviset turnaukset, omat yhteyshenkilöt",
      },
    ],
    pros: [
      "Laaja maksutapavalikoima",
      "Nopeat kotiutukset",
      "Suomenkielinen 24/7 tuki",
      "MGA-lisenssi (verovapaat voitot)",
    ],
    cons: ["Ei erityisiä merkittäviä miinuksia"],
  },
  "twin-casino": {
    slug: "twin-casino",
    name: "Twin Casino",
    title: "Twin Casino Arvostelu — Perustettu 2017, Jatkuvat Tarjoukset",
    license: "Anjouan",
    licenseFlag: "🏝️",
    paymentMethods:
      "Trustly, Zimpler, Visa, Mastercard, Skrill, Neteller, Paysafe, ecoPayz, Pankkisiirto. Kaikki maksut ilmaiset.",
    welcomeBonus:
      "100% bonus 100€ asti + 50 ilmaiskierrosta (Starstruck) ensitalletuksella. 100% bonus 100€ asti + 50 ilmaiskierrosta toisella talletuksella.",
    games:
      "1000+ peliä — NetEnt, Play'n GO, Microgaming, Pragmatic Play, Nolimit City, BTG, Evolution ym.",
    withdrawals: "Nopea käsittely, rahat liikkuvat ripeästi",
    support: "24/7, suomenkielinen rajallisesti",
    extras: [
      {
        title: "Twin Races",
        content: "Ilmaiset turnaukset, palkintona käteistä ja ilmaiskierroksia",
      },
      {
        title: "Lojaaliohjelma",
        content:
          "Automatisoitu pistejärjestelmä, tasopalkinnot valittavissa (käteinen, bonukset, kierrokset, arpaliput)",
      },
    ],
    pros: [
      "Jatkuvat tarjoukset",
      "Automatisoitu palkintojärjestelmä",
      "Laaja maksutapavalikoima",
    ],
    cons: ["Suomenkielinen tuki rajallinen", "Anjouan-lisenssi"],
  },
  tykitys: {
    slug: "tykitys",
    name: "Tykitys",
    title: "Tykitys Casino Arvostelu 2026 — Uusi Pikakasino Räjäytti Tien Auki",
    license: "Curaçao (Fruity Entertainment BV, lisenssi OGL/2024/1487/0729)",
    licenseFlag: "🇨🇼",
    licenseTaxNote:
      "Huom: Curaçao-lisensoiduilla kasinoilla voitot ovat verotettavia suomalaisille pelaajille.",
    paymentMethods:
      "Brite (Pay N Play), minimitalletus 20€, max kotiutus 5000€/pv",
    welcomeBonus:
      "333 ilmaiskierrosta — 83 heti + 50/pv seuraavana 5 päivänä. Vaatii päivittäisen kirjautumisen. 35x kierrätys, 7 päivää voimassa.",
    games:
      "3600+ peliä — NetEnt, Play'n GO, Pragmatic Play, Nolimit City, Hacksaw, Evolution ym.",
    withdrawals: "Alle 10 minuuttia",
    support: "Live-chat 24/7 suomeksi, support@tykitys.com",
    extras: [
      {
        title: "Cashback",
        content: "10–20% päivittäinen (10x kierrätys), lunastettavissa klo 13 jälkeen",
      },
      {
        title: "Tykitysmittari",
        content:
          "Aktiivisuuteen perustuva uskollisuusohjelma, palkitsee ilmaiskierroksilla suosikkipeliin",
      },
      {
        title: "Progressiiviset jackpotit",
        content:
          "4 omaa jättipottia (lähtötasot 25 000€, 5 000€, 100€, 2€)",
      },
    ],
    pros: [
      "Antelias tervetuliaisbonus",
      "Progressiiviset jackpotit",
      "Suomenkielinen 24/7 tuki",
      "Nopeat kotiutukset",
    ],
    cons: [
      "Cashbackissa 10x kierrätys",
      "Vain Brite maksutapana",
      "Curaçao-lisenssi (voitot verotettavia)",
    ],
  },
  kassuuu: {
    slug: "kassuuu",
    name: "Kassuuu",
    title: "Kassuuu Arvostelu — Rehti Pikakasino Ilman Turhaa Säätöä",
    license: "EMTA (Viro)",
    licenseFlag: "🇪🇪",
    paymentMethods: "Zimpler (Pay N Play), minimitalletus 20€",
    welcomeBonus:
      "200 ilmaiskierrosta ensitalletuksella. Pelivalinta: Money Train 4 (erittäin korkea volatiliteetti, max 150 000x), Le Bandit (korkea, max 10 000x) tai Big Bass Bonanza (keskikorkea, max 2100x).",
    games:
      "1000+ peliä — Play'n GO, NetEnt, Pragmatic Play, Nolimit City, Hacksaw, Evolution, BTG ym.",
    withdrawals: "Alle 15 minuuttia, automaattinen käsittely",
    support: "Live-chat 09–02, asiakaspalvelu@kassuuu.com, suomeksi",
    extras: [
      {
        title: "Uskollisuusohjelma",
        content:
          "Tasopalkinnot aktiivisuudesta, usein kierrätysvapaita ilmaiskierroksia",
      },
    ],
    pros: [
      "Verovapaat voitot (EMTA)",
      "Persoonallinen brändi",
      "Kierrätysvapaat palkinnot",
      "Nopeat kotiutukset",
    ],
    cons: ["Ei perinteistä talletusbonusta", "Chat ei auki 24/7"],
  },
  "lapland-casino": {
    slug: "lapland-casino",
    name: "Lapland Casino",
    title: "Lapland Casino Arvostelu — Pohjolan Paras Nettikasino?",
    license: "EMTA (Viro)",
    licenseFlag: "🇪🇪",
    paymentMethods: "Trustly (Pay N Play), maksut ilmaisia",
    welcomeBonus:
      "Ei perinteistä talletusbonusta. Kultajahti-uskollisuusohjelma: pelaamalla täytät mittaria, Jeti-maskotti paljastaa palkintoja (ilmaiskierroksia, pääpalkintona 5000€ arvoiset kierrokset). KultaTURBO-pelit täyttävät mittaria nopeammin.",
    games:
      "1000+ peliä — NetEnt, Play'n GO, Pragmatic Play, Nolimit City, Hacksaw, Evolution ym. Älykkäät kategoriat: 'Voitat usein' ja 'Voitat paljon'.",
    withdrawals: "Sekunneista minuutteihin",
    support: "Live-chat ja sähköposti, suomeksi",
    pros: [
      "Upea Lapin teema",
      "Kultajahti-järjestelmä",
      "Verovapaat voitot",
      "Salamannopeat kotiutukset",
      "Älykäs pelien kategoriointi",
    ],
    cons: ["Ei perinteistä talletusbonusta", "Vain Trustly maksutapana"],
  },
};