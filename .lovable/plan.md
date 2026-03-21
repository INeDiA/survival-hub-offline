
Obiettivo: al primo avvio su un dispositivo, invece di mostrare un archivio vuoto, l’app propone una scelta tra più template di zaino già pronti, con nome/descrizione/lista oggetti localizzati in italiano e inglese. Dopo la scelta, i dati vengono creati una sola volta nel browser dell’utente.

1. Flusso UX
- Rilevare “prima esecuzione” controllando se non esistono zaini e se non è già stato completato l’onboarding.
- Mostrare un dialog/pannello iniziale sopra la homepage con:
  - breve spiegazione
  - 2-4 template selezionabili
  - pulsante “Usa questo template”
  - opzione “Inizia da zero”
- Una volta scelto:
  - creare 1 zaino + elenco oggetti precompilato
  - chiudere il dialog
  - salvare un flag locale per non mostrarlo più automaticamente

2. Struttura dati proposta
Aggiungerei un catalogo statico, ad esempio in `src/lib/starter-templates.ts`, con:
- id template
- nome/descrizione in `it` e `en`
- peso limite e peso zaino
- elenco item con:
  - nome it/en
  - categoria
  - peso
  - quantità
  - checked default
  - note it/en opzionali

Esempio logico:
```text
template
  bag: { name.it, name.en, description.it, description.en, ... }
  items: [
    { name.it, name.en, category, weight, quantity, checked }
  ]
```

3. Integrazione con la lingua
Poiché oggi la lingua è gestita da `use-language.tsx`, i template useranno testi bilingue nello stesso stile:
- se lingua corrente = `it`, si crea il template in italiano
- se lingua corrente = `en`, si crea il template in inglese

Questo evita traduzioni “vive” dopo il salvataggio: il contenuto viene materializzato già nella lingua scelta in quel momento, coerente con il resto dei dati utente.

4. Dove agganciare la logica
File coinvolti:
- `src/pages/Index.tsx`
  - mostra il dialog di primo avvio
  - decide se aprirlo
- nuovo componente, es. `src/components/StarterTemplateDialog.tsx`
  - UI della scelta template
- `src/lib/db.ts`
  - aggiunta helper per inserimento iniziale atomico di bag + items
- `src/lib/types.ts`
  - eventuali tipi per starter template
- nuovo file, es. `src/lib/starter-templates.ts`
  - definizione template precompilati

5. Logica di inizializzazione
Implementazione consigliata:
- all’avvio della homepage:
  - leggere `bags`
  - se `bags.length === 0` e `localStorage` non contiene `bugout-onboarding-completed`, aprire il dialog
- se utente sceglie un template:
  - generare nuovi `id`
  - creare bag e item in IndexedDB
  - invalidare query React Query (`bags`, `items`)
  - salvare flag onboarding completato
- se utente sceglie “Inizia da zero”:
  - nessun dato creato
  - salvare comunque il flag per non riproporlo ogni volta

6. Template consigliati
Dato che hai chiesto scelta tra vari template, proporrei inizialmente 3:
- BOB 72h
  - setup generale equilibrato
- Emergenza civile
  - blackout, evacuazione, documenti, torcia, radio, powerbank, acqua
- Minimalista
  - kit essenziale leggero

7. Comportamento con backup/import
Per evitare effetti collaterali:
- il template compare solo quando il database è vuoto
- dopo un import backup, non deve più apparire
- se l’utente cancella tutti gli zaini manualmente, possiamo decidere:
  - comportamento semplice: non riapparire, perché onboarding già completato
  - opzionale futura: voce nel menu hamburger “Carica template iniziale”

8. Nota sui dati pubblici / privacy
Tutto resta locale come oggi:
- il template viene creato nel browser del dispositivo
- non viene inviato a un server
- ogni utente del link pubblico avrà il proprio primo avvio separato

9. Dettagli tecnici
- Meglio usare un inserimento atomico in IndexedDB per evitare stato parziale.
- Conviene non “tradurre al volo” i nomi item già salvati: il template va scritto nella lingua corrente al momento della creazione.
- Il dialog deve essere piccolo e guidato, non invasivo, coerente con la scelta fatta in precedenza per mantenere menu compatti.
- Se vuoi, in una seconda fase possiamo aggiungere miniature/icona per ogni template e una voce nel menu per reinserire un template manualmente.

10. Piccola nota sul build error mostrato
L’errore `vite: command not found` non sembra legato a questa feature applicativa, ma all’ambiente/command runner del progetto. Quando passerò all’implementazione controllerò prima `package.json` e gli script per capire se il progetto sta usando `bun`, `npm` o se manca la dipendenza/risoluzione del binario.

Se approvi, implementerei così:
1. catalogo template statici bilingue
2. dialog di primo avvio con scelta template o avvio vuoto
3. seed iniziale in IndexedDB con invalidazione query
4. protezione “una sola volta per dispositivo”
5. rifinitura copy in italiano/inglese
