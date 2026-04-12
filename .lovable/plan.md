

## Fix: Pulsanti StarterTemplateDialog non funzionanti su iPhone

### Causa probabile
Due problemi concorrenti:

1. **Il widget Ko-fi floating** (z-index alto, posizionato in basso) si sovrappone ai pulsanti del dialog footer su schermi piccoli, intercettando i tap
2. **Il contenuto del dialog eccede l'altezza del viewport** su iPhone (header + 3 card + footer), senza max-height ne' scroll — i pulsanti potrebbero trovarsi sotto il widget Ko-fi o parzialmente fuori schermo

### Soluzione

**1. `src/components/StarterTemplateDialog.tsx`**
- Aggiungere `max-h-[85dvh] overflow-y-auto` al `DialogContent` per limitare l'altezza e abilitare lo scroll
- Questo garantisce che i pulsanti del footer siano sempre visibili e raggiungibili

**2. `index.html`**
- Aggiungere al widget Ko-fi uno z-index inferiore a quello del dialog (z-50), ad esempio impostando `z-index: 40` sul container del widget, oppure nasconderlo quando un dialog e' aperto. L'approccio piu' semplice: aggiungere una regola CSS che nasconde il widget Ko-fi quando l'overlay del dialog e' presente:

```css
/* Nasconde Ko-fi quando un dialog modale e' aperto */
[data-radix-dialog-overlay] ~ .floatingchat-container-wrap,
[data-radix-dialog-overlay] ~ .floatingchat-container-wrap-mobi {
  display: none !important;
}
```

Questa regola va aggiunta in `src/index.css` (selettore fratello: quando l'overlay Radix e' nel DOM, il widget Ko-fi viene nascosto).

### File coinvolti
- **`src/components/StarterTemplateDialog.tsx`** — max-height + scroll
- **`src/index.css`** — regola CSS per nascondere Ko-fi durante i dialog

