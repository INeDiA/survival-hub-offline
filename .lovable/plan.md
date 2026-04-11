

## Piano: Welcome screen mobile-first + voce About nel menu

### Panoramica
Al primo accesso, **prima** della scelta template, compare una schermata di benvenuto con 3 info chiave (privacy, offline, export). Le stesse info saranno accessibili in qualsiasi momento dal menu hamburger.

### Design mobile-first
- Layout a **stack verticale** con icone grandi (h-8 w-8) e testo sotto ciascuna
- Padding generoso, testi brevi (1 riga di titolo + 1 riga di descrizione)
- Dialog a larghezza piena su mobile (`max-w-sm` centrato)
- Pulsante "Continua" grande e full-width in fondo
- Nessuno scroll necessario: 3 blocchi compatti + 1 pulsante

### File coinvolti

**1. `src/components/WelcomeDialog.tsx`** (nuovo)
- Dialog modale con 3 card verticali:
  - **ShieldCheck** — "I tuoi dati restano sul tuo dispositivo" / "Your data stays on your device"
  - **WifiOff** — "Funziona anche offline" / "Works offline too"
  - **Download** — "Esporta i tuoi dati quando vuoi" / "Export your data anytime"
- Pulsante "Continua" / "Continue" chiude il dialog
- Prop `open` / `onContinue`

**2. `src/hooks/use-language.tsx`**
- Aggiunta traduzioni EN/IT per welcome screen e voce About menu

**3. `src/pages/Index.tsx`**
- Nuovo stato `welcomeOpen`: al primo accesso si apre il Welcome, al click "Continua" si apre il template dialog
- Flag localStorage `bugout-welcome-seen` per non ripresentarlo

**4. `src/components/HamburgerMenu.tsx`**
- Nuova voce "About" (icona Info) che apre lo stesso WelcomeDialog

### Flusso primo accesso
```text
WelcomeDialog (privacy / offline / export)
  → "Continua"
    → StarterTemplateDialog (scelta template)
```

