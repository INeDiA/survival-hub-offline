

## Fix: Ko-fi widget sovrappone l'ultimo elemento della lista

### Problema
Il widget Ko-fi floating si posiziona in basso a destra/sinistra sullo schermo, coprendo l'ultimo elemento delle liste sia nella pagina principale (Index) che nella pagina dettaglio zaino (BagDetail).

### Soluzione
Aggiungere padding-bottom sufficiente al `<main>` di entrambe le pagine per lasciare spazio al widget Ko-fi (~80px).

### File coinvolti

**1. `src/pages/Index.tsx`** (riga 118)
- Cambiare `py-6` in `pt-6 pb-24`

**2. `src/pages/BagDetail.tsx`** (riga 128)
- Cambiare `py-6` in `pt-6 pb-24`

