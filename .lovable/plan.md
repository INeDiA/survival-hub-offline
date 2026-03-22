
Obiettivo: aggiungere, solo nella tua vista di sviluppo/preview, un piccolo pannello di amministrazione nascosto agli utenti pubblici per modificare facilmente via interfaccia i 3 template iniziali.

Approccio consigliato
- Non toccherei il flusso utente pubblico.
- Aggiungerei una modalità “template editor” visibile solo in preview/dev, rilevata dal contesto della pagina (non dal menu pubblico, non da dati utente).
- Da lì potrai:
  - vedere i 3 template
  - modificare nome, descrizione, limiti peso e peso zaino in entrambe le lingue
  - modificare gli item del template (nome it/en, categoria, peso, quantità, checked, note)
  - aggiungere/rimuovere item
  - copiare/esportare il JSON aggiornato del catalogo per reinserirlo velocemente nel file sorgente

Come la farei
1. Isolamento “solo per me”
- Mostrerei l’editor solo quando l’app gira nella preview Lovable o in ambiente locale/dev.
- Sul sito pubblicato non verrebbe renderizzato nulla.
- Eviterei qualsiasi toggle salvato in localStorage: deve dipendere dall’ambiente, non dall’utente.

2. UI dedicata e discreta
- Aggiungerei un pulsante secondario piccolo, visibile solo in preview, vicino all’header o in fondo alla homepage.
- Il pulsante apre un dialog dedicato “Template editor”.
- Dentro il dialog:
  - colonna/lista dei 3 template
  - form del template selezionato
  - sezione elenco item con editor inline o mini-card
  - pulsanti “Aggiungi item”, “Ripristina template originale”, “Copia JSON”

3. Modello dati
- Riutilizzerei `src/lib/starter-templates.ts` come fonte iniziale.
- Per rendere l’editing semplice, esporterei anche il catalogo completo dei template, non solo le funzioni helper.
- L’editor lavorerebbe su una copia locale in memoria, senza toccare subito il comportamento dell’onboarding.

4. Persistenza per la sola preview
Due opzioni; consigliata la prima:
- Opzione A: modifiche temporanee nella sessione + pulsante “Copia JSON”
  - più sicura
  - nessun rischio di lasciare configurazioni speciali in produzione
  - tu copi il payload finale e poi si aggiorna il file sorgente
- Opzione B: persistenza locale in `localStorage` ma solo in preview
  - utile per iterare
  - l’onboarding in preview usa i template sovrascritti localmente
  - sul published ignora tutto

Io farei B + “Ripristina defaults”, così puoi provare davvero il primo avvio senza modificare subito il codice definitivo.

5. Integrazione con onboarding
- `Index.tsx` continuerebbe a usare `getStarterTemplates` e `buildStarterTemplateData`.
- Queste funzioni leggerebbero:
  - templates custom da preview/localStorage, se presenti e se siamo in preview
  - altrimenti i template statici attuali
- Così puoi verificare subito la resa del dialog iniziale.

6. Sicurezza / visibilità
- Nessun utente pubblico vedrà:
  - il pulsante
  - il dialog
  - i template custom da editor
- Il controllo sarà lato rendering in base all’ambiente preview/dev.
- Non userei ruoli, credenziali o controlli “admin”: qui serve solo una utility di sviluppo, non un feature pubblico.

File coinvolti
- `src/lib/starter-templates.ts`
  - esportare/normalizzare il catalogo template
  - aggiungere helper per leggere eventuali override preview
- nuovo `src/components/TemplateEditorDialog.tsx`
  - interfaccia completa di modifica
- `src/pages/Index.tsx`
  - mostrare il trigger solo in preview
- opzionale nuovo helper, es. `src/lib/dev-mode.ts`
  - centralizzare il check “preview/dev only”

Nota importante
- Oggi i template sono hardcoded nel sorgente: un editor UI non può aggiornare fisicamente il file TS da browser.
- Quindi la soluzione corretta è: editor visuale + override locale per test + export/copia del JSON finale.
- Se in seguito vuoi un vero backoffice persistente e privato, allora servirebbe un backend, cosa che qui al momento non c’è.

Dettagli tecnici
- Controllo visibilità:
```text
mostra editor se:
- hostname contiene lovable.app con preview
oppure
- ambiente dev locale
```
- Struttura editor:
```text
Dialog
  sidebar template list
  form generale template
  lista item modificabili
  actions: add / remove / reset / copy json
```
- Validazioni:
  - peso >= 0
  - quantità >= 1
  - categoria tra quelle supportate
  - testi non vuoti per nome zaino e nome item

Implementazione proposta
1. introdurre un check centralizzato “preview/dev only”
2. rendere il catalogo template esportabile e sovrascrivibile in preview
3. creare il dialog editor con form per template e item
4. collegare l’onboarding agli override della preview
5. aggiungere copia JSON e ripristino defaults

Rischi/attenzioni
- Se usiamo override locali, bisogna etichettare chiaramente che valgono solo in preview.
- Conviene evitare di inserire il trigger nel menu hamburger, per non mescolare tool dev e UI utente.
- Il dialog deve essere scrollabile e ordinato, perché i template hanno molti campi.

Suggerimento UX finale
- Metterei un piccolo pulsante “Edit templates” visibile solo in preview, non nel menu hamburger.
- È più pulito, più chiaramente “strumento da sviluppatore” e impossibile da confondere con una funzione utente.
