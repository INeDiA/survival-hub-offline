import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { exportAllData, downloadJson, importFromJson } from "@/lib/export-import";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function ExportImportDialog() {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const handleExport = async () => {
    try {
      const json = await exportAllData();
      const date = new Date().toISOString().slice(0, 10);
      downloadJson(json, `bugout-backup-${date}.json`);
      toast.success("Backup esportato con successo");
    } catch {
      toast.error("Errore durante l'esportazione");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = await importFromJson(text);
      qc.invalidateQueries();
      toast.success(`Importati ${result.bags} zaini e ${result.items} oggetti`);
      setOpen(false);
    } catch (err) {
      toast.error("File non valido o corrotto");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Backup
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Backup & Ripristino</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={handleExport} className="w-full gap-2">
            <Download className="h-4 w-4" /> Esporta tutti i dati (JSON)
          </Button>
          <div className="relative">
            <Button variant="outline" className="w-full gap-2" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Importa backup
            </Button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
          <p className="text-xs text-muted-foreground">
            ⚠ L'importazione sovrascriverà tutti i dati esistenti.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
