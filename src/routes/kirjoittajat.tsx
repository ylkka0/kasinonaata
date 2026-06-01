import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CmsExtra } from "@/components/CmsExtra";
import jiriPhoto from "@/assets/jiri-kaartinen.png";

export const Route = createFileRoute("/kirjoittajat")({
  head: () => ({
    meta: [
      { title: "Kirjoittajat – Kasinonäätä" },
      {
        name: "description",
        content:
          "Tutustu Kasinonäädän kirjoittajiin ja iGaming-asiantuntijoihin.",
      },
    ],
  }),
  component: KirjoittajatPage,
});

function KirjoittajatPage() {
  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <nav className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">Etusivu</Link>
          <span className="mx-2">/</span>
          <span>Toimitus</span>
          <span className="mx-2">/</span>
          <span className="text-gold">Kirjoittajat</span>
        </nav>

        <h1 className="font-display text-5xl mb-2">Kirjoittajat</h1>
        <p className="text-muted-foreground mb-10">
          Kasinonäädän tiimissä on alan ammattilaisia, joilla on vuosien
          kokemus rahapelialalta sekä pöydän että pelaajan puolelta.
        </p>

        <article className="bg-surface gold-border rounded-2xl p-6 md:p-10">
          <header className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
            <img
              src={jiriPhoto}
              alt="Jiri Kaartinen"
              width={140}
              height={140}
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover gold-border gold-glow"
            />
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-gold mb-1">
                Jiri Kaartinen
              </h2>
              <p className="text-sm uppercase tracking-wider text-foreground/80 mb-2">
                iGaming-asiantuntija · Päätoimittaja, Britekasino.com
              </p>
              <p className="text-sm text-muted-foreground">
                15 vuotta rahapelialalla – Casino Helsingistä Maltan
                nettikasinoille.
              </p>
            </div>
          </header>

          <div className="prose prose-invert max-w-none space-y-4 text-foreground/90">
            <p>
              Olen Britekasino.comin päätoimittaja ja toiminut 15 vuotta eri
              tehtävissä kasinoalalla. Olen seissyt pöydän molemmin puolin:
              ensin pokeridiilerinä ympäri pääkaupunkiseutua, sen jälkeen
              senior diilerinä Casino Helsingissä viiden vuoden ajan, josta
              siirryin työskentelemään viidelle eri nettikasinolle Maltalla
              ja etänä eri maista. Viimeisimpänä toimin Senior Fraud and
              Payments Analystina Esports Entertainment Groupille
              (NASDAQ: GMBL).
            </p>
            <p>
              Tämä on harvinainen yhdistelmä, jonka takia minulla on uniikki
              näkemys alan eri puolista. Olen nähnyt miltä näyttää talon
              häviäminen ruletissa, miten eri tavalla pelaajat käyttäytyvät
              kommunikoidessaan nettikasinoilla, miten eri maksutavat —
              Brite, Trustly, Zimpler, Viljo — käyttäytyvät eri pankkien
              kanssa, sekä miten eri nettikasinot tulkitsevat lisenssi-
              säädöksiään ja velvollisuuksiaan.
            </p>

            <h3 className="font-display text-2xl text-gold pt-4">
              Urani lyhyesti
            </h3>
            <p>
              Aloitin vuonna 2009 vetämällä pokeriturnauksia pääkaupunki-
              seudun baareissa. Vuosina 2012–2017 toimin senior diilerinä
              Casino Helsingissä, jossa vastasin pöytäpeleistä ja pokerista,
              uusien jakajien perehdytyksestä sekä pöydän riskeistä, kuten
              väärennetystä rahasta, epäilyttävistä panoksista ja
              tiimipelaamisesta.
            </p>
            <p>
              Vuonna 2017 siirryin Maltalle verkkokasinoiden puolelle.
              Työpaikkoihini kuuluvat Lucky Dino Gaming, Max Entertainment,
              Bethard Group, Dino Technologies ja Esports Entertainment
              Group (NASDAQ: GMBL). Rooleissani olen käsitellyt lukemattomia
              talletuksia ja kotiutuksia, tutkinut chargebackeja, tehnyt
              KYC- ja EDD-tarkistuksia, kommunikoinut maksupalvelun-
              tarjoajien kanssa sekä rakentanut sisäisiä prosesseja bonusten
              väärinkäytön havaitsemiseksi ja ehkäisemiseksi.
            </p>
            <p>
              Vuosina 2019–2020 toimin lisäksi Gaming Innovation Groupilla
              Site Managerina vastaten Suomen markkinan sisältöstrategiasta
              — SEO-sisällön tilaamisesta ja tuottamisesta sekä
              sisältökumppanuuksien kehittämisestä.
            </p>

            <h3 className="font-display text-2xl text-gold pt-4">
              Miten testaan kasinot?
            </h3>
            <p>
              Jokainen kasinoarvio perustuu oikeaan pelitiliin, oikeisiin
              talletuksiin ja oikeisiin kotiutuksiin. Rekisteröidyn omilla
              pelitunnuksilla ja testaan kasinon eri toiminnot oikealla
              pelitilillä. Teen vähintään yhden talletuksen ja yhden
              kotiutuksen, testaan asiakaspalvelun kysymyksillä joita itse
              olen vastaanottanut chatissa uusilta pelaajilta, tarkistan
              lisenssitiedot suoraan lisensoivan viranomaisen (MGA, EMTA)
              rekisteristä, ja luen bonusehdot läpi nostaen esiin ne kohdat,
              jotka pelaajan tulee ehdottomasti huomioida ennen ensimmäistä
              bonustalletusta.
            </p>

            <h3 className="font-display text-2xl text-gold pt-4">
              Miten päädyit rahapelialalle?
            </h3>
            <p>
              Vuonna 2009 aloin vetää ilmaisia pokeriturnauksia baareissa
              Helsingin ja Espoon alueella koulun ohella. Parin vuoden
              jälkeen Raha-automaattiyhdistyksen kouluttajat huomasivat,
              että olin jo varsin pätevä pokeridiileri, jonka jälkeen
              heidän suosituksestaan päädyin Casino Helsingin haastatteluun.
              Vuosien kokemus pöydän molemmin puolin — niin asiakkaana
              kuin kasinohenkilökuntana — on antanut hyvän näkemyksen
              siitä, mikä pelaajalle on tärkeää.
            </p>

            <h3 className="font-display text-2xl text-gold pt-4">
              Mitä pelaajat eivät tiedä kasinon toiminnasta?
            </h3>
            <p>
              Varsinkaan uudet pelaajat eivät tiedä, mitä eroa eri
              lisensseillä on — ymmärrettävästi. Myös säännöt ja ehdot
              voivat erota hyvinkin paljon eri kasinoiden välillä, ja tästä
              tulee pelaajille paljon yllätyksiä.
            </p>

            <h3 className="font-display text-2xl text-gold pt-4">
              Mihin kiinnität huomiota ensimmäisenä, kun arvioit uutta
              kasinoa?
            </h3>
            <p>
              Lisenssiin ja siihen, onko se voimassa. Tarkistan aina
              suoraan viranomaisen rekisteristä. Säännöt ja ehdot ovat
              tärkeitä, kuten maksimivoitto, maksurajat voitoille ja
              bonusten kierrätysvaatimukset.
            </p>

            <h3 className="font-display text-2xl text-gold pt-4">
              Mitä pelejä itse pelaat?
            </h3>
            <p>
              Pokeri on sydäntä lähellä Casino Helsingin vuosien puolesta,
              ja erityisesti Pot Limit Omaha kiinnostaa muutaman kaljan
              jälkeen. Sloteista eniten olen pyörittänyt vanhaa kunnon
              Immortal Romancea. En koskaan suosittele peliä, jota en ole
              itse testannut.
            </p>

            <h3 className="font-display text-2xl text-gold pt-4">
              Mitkä ovat punaisia lippuja pelaajalle?
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-gold">Nostojen nopeus:</strong>{" "}
                kotiutukset viivästyvät toistuvasti ilman selitystä.
              </li>
              <li>
                <strong className="text-gold">Pelien RTP:</strong> monelta
                pelaajalta jää tarkistamatta, ja useissa paikoissa RTP voi
                olla jopa vain 90 %.
              </li>
              <li>
                <strong className="text-gold">Vastuullinen pelaaminen:</strong>{" "}
                työkalujen puuttuminen tai piilottaminen. Vielä tänäkin
                päivänä on nettikasinoita, joissa vastuullista pelaamista
                ei oteta vakavasti.
              </li>
            </ul>
          </div>
        </article>
      </section>
      <CmsExtra slug="kirjoittajat" />
    </Layout>
  );
}
