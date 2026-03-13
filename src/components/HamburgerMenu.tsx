import { useState, useRef } from "react";
import { Menu, Download, Upload, Share2, Moon, Sun, Globe, Weight, Smartphone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { exportAllData, downloadJson, importFromJson } from "@/lib/export-import";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { useWeightUnit } from "@/hooks/use-weight-unit.tsx";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { useExpiryDays } from "@/hooks/use-expiry-days";


export function HamburgerMenu() {
  const [backupOpen, setBackupOpen] = useState(false);
  const [expiryOpen, setExpiryOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const { theme, toggle } = useTheme();
  const { lang, t, setLang } = useLanguage();
  const { unit, setUnit } = useWeightUnit();
  const pwa = usePwaInstall();
  const { expiryWarningDays, setExpiryWarningDays } = useExpiryDays();

  const nextUnit = unit === "kg" ? "lbs" : "kg";
  const expiryOptions = [14, 30, 60, 90];

  const handleExport = async () => {
    try {
      const json = await exportAllData();
      const date = new Date().toISOString().slice(0, 10);
      downloadJson(json, `bugout-backup-${date}.json`);
      toast.success(t.backupSuccess);
    } catch {
      toast.error(t.backupError);
    }
  };

  const handleShare = async () => {
    try {
      const json = await exportAllData();
      const date = new Date().toISOString().slice(0, 10);
      const filename = `bugout-backup-${date}.json`;
      const file = new File([json], filename, { type: "application/json" });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: filename });
          return;
        } catch (shareErr: any) {
          if (shareErr?.name === "AbortError") return;
          // share failed (e.g. desktop), fall through to download
        }
      }
      toast.info(t.shareNotSupported);
      downloadJson(json, filename);
    } catch {
      toast.error(t.backupError);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = await importFromJson(text);
      qc.invalidateQueries();
      toast.success(t.importSuccess(result.bags, result.items));
      setBackupOpen(false);
    } catch {
      toast.error(t.importError);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={toggle}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {theme === "dark" ? t.lightTheme : t.darkTheme}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLang(lang === "en" ? "it" : "en")}>
            <Globe className="mr-2 h-4 w-4" />
            {lang === "en" ? "Italiano" : "English"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUnit(nextUnit)}>
            <Weight className="mr-2 h-4 w-4" />
            {nextUnit === "kg" ? "Kg" : t.lbsLabel}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setExpiryOpen(true)}>
            <Clock className="mr-2 h-4 w-4" />
            {t.expiryWarningLabel}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setBackupOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            {t.backupRestore}
          </DropdownMenuItem>
          {pwa.canInstall && !pwa.isIos && (
            <DropdownMenuItem onClick={pwa.install}>
              <Smartphone className="mr-2 h-4 w-4" />
              {t.installApp}
            </DropdownMenuItem>
          )}
          {pwa.canInstall && pwa.isIos && (
            <DropdownMenuItem disabled className="text-xs opacity-70">
              <Smartphone className="mr-2 h-4 w-4" />
              {t.iosInstallGuide}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={backupOpen} onOpenChange={setBackupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.backupRestore}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={handleExport} className="w-full gap-2">
              <Download className="h-4 w-4" /> {t.exportAll}
            </Button>
            <Button variant="outline" onClick={handleShare} className="w-full gap-2">
              <Share2 className="h-4 w-4" /> {t.shareBackup}
            </Button>
            <div className="relative">
              <Button variant="outline" className="w-full gap-2" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4" /> {t.importBackup}
              </Button>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            </div>
            <p className="text-xs text-muted-foreground">
              {t.importWarning}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={expiryOpen} onOpenChange={setExpiryOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t.expiryWarningLabel}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {expiryOptions.map((d) => (
              <Button
                key={d}
                variant={expiryWarningDays === d ? "default" : "outline"}
                size="sm"
                className="text-sm"
                onClick={() => {
                  setExpiryWarningDays(d);
                  setExpiryOpen(false);
                }}
              >
                {t.expiryWarningDaysLabel(d)}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
