

## Piano: Pagina Impostazioni dedicata + menu snello

### Obiettivo
Spostare le preferenze (tema, lingua, unita di peso, giorni scadenza) in una pagina `/settings` dedicata. Il menu hamburger resta leggero con solo le azioni principali.

### Menu hamburger (dopo)
1. Crea da template (nuovo)
2. Backup / Ripristino
3. Installa app (PWA, condizionale)
4. Impostazioni (link a /settings)
5. About / Info

### Pagina /settings
Una pagina semplice con card/sezioni per:
- **Tema**: toggle chiaro/scuro
- **Lingua**: selettore EN / IT
- **Unita di peso**: selettore kg / lbs
- **Avviso scadenza**: bottoni 14 / 30 / 60 / 90 giorni

Header con titolo "Impostazioni" e freccia indietro per tornare alla home.

### File coinvolti

**1. `src/pages/Settings.tsx`** (nuovo)
- Pagina con le 4 sezioni di preferenze, layout a card
- Usa gli stessi hook esistenti (`useTheme`, `useLanguage`, `useWeightUnit`, `useExpiryDays`)
- Header con pulsante back (navigazione a `/`)

**2. `src/App.tsx`**
- Aggiungere route `/settings` → `Settings`

**3. `src/components/HamburgerMenu.tsx`**
- Rimuovere le voci tema, lingua, unita peso, scadenza
- Aggiungere voce "Crea da template" (icona `Package`)
- Aggiungere voce "Impostazioni" (icona `Settings`) che naviga a `/settings`
- Importare `StarterTemplateDialog` e logica di creazione zaino da template

**4. `src/hooks/use-language.tsx`**
- Aggiungere stringhe: `settings`, `createFromTemplate`, `templateAdded`, `themeLabel`, `languageLabel`, `weightUnitLabel`, `back`

