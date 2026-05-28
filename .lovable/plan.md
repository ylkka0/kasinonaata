## CMS-laajennus — suunnitelma

### 1. Kasinoiden CMS — Plussat & Miinukset
- Lisätään admin-lomakkeeseen kaksi listakenttää (rivi per kohta, "+ lisää" -nappi, poistonappi).
- `pros` ja `cons` -sarakkeet ovat jo tietokannassa (text[]) — ei migraatiota tarvita.
- Näytetään plussat (vihreä +) ja miinukset (punainen –) kasinokortissa (CasinoCard) ja kasinon yksittäissivulla samalla tyylillä kuin viittauskuvasi.

### 2. Drag & Drop -järjestys
- Asennetaan `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- Adminin kasinolistaus: vedä riviä → tallentaa `ranking`-arvot tietokantaan (1, 2, 3 …).
- Sama myös blogiartikkeleille: lisätään `display_order` -sarake (migraatio) ja sortataan sen mukaan.

### 3. Logojen siistimpi näyttö
- Vakioidaan logojen kontti: yhtenäinen koko (64×64), `object-contain`, vaalea tausta + reuna, joten erikokoiset logot näyttävät tasaisilta.
- Adminissa logon esikatselu samalla tyylillä kuin etusivulla → näet heti miltä se näyttää.
- Kasinokorttiin lisätään myös pieni "logo + nimi" -rivi yhtenäisesti.

### 4. Helpompi blogi-editor
- Vaihdetaan markdown-textarea **rich text -editoriin** (TipTap):
  - Lihavointi, kursiivi, otsikot (H2/H3), listat, lainaukset, linkit
  - Kuvan upotus suoraan (lataa → lisää kursorin kohtaan)
  - Esikatselu suoraan editorissa (WYSIWYG)
- Tallennetaan HTML-muodossa `content`-kenttään (taaksepäin yhteensopiva: jos vanhoissa artikkeleissa on markdown, ne renderöidään edelleen oikein).
- Asennetaan `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`.

### 5. Tietokantamuutokset (yksi migraatio)
- `ALTER TABLE blog_posts ADD COLUMN display_order int NOT NULL DEFAULT 0;`
- Indeksi `display_order`-sarakkeelle.

### Tekninen yhteenveto
- Riippuvuudet: `@dnd-kit/*`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`.
- Muokattavat tiedostot: `src/routes/admin.tsx` (laajennetaan molempia paneeleita), `src/components/CasinoCard.tsx` (plussat/miinukset + logon kontti), `src/routes/kasinot.$slug.tsx` (plussat/miinukset isompana), `src/routes/blogi.$slug.tsx` (HTML-rendaus).
- Uudet komponentit: `src/components/admin/SortableList.tsx`, `src/components/admin/RichTextEditor.tsx`, `src/components/admin/StringListInput.tsx` (plussat/miinukset).
- Connectoreita ei tarvita — kaikki toimii Lovable Cloudin päällä.

Hyväksy niin aloitan toteutuksen.
