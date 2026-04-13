import { useState, useRef } from "react";
import { Menu, Download, Upload, Share2, Smartphone, Info, Settings, Package } from "lucide-react";
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
import { useLanguage } from "@/hooks/use-language";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { StarterTemplateDialog } from "@/components/StarterTemplateDialog";
import { getStarterTemplates, buildStarterTemplateData } from "@/lib/starter-templates";
import { seedBagWithItems } from "@/lib/db";
import { useNavigate } from "react-router-dom";

export function HamburgerMenu() {
  const [backupOpen, setBackupOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [templatePending, setTemplatePending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const { lang, t } = useLanguage();
  const pwa = usePwaInstall();
  const navigate = useNavigate();

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

  const handleTemplateConfirm = async (templateId: string) => {
    setTemplatePending(true);
    try {
      const { bag, items } = buildStarterTemplateData(templateId, lang);
      await seedBagWithItems(bag, items);
      qc.invalidateQueries();
      toast.success(t.templateAdded);
      setTemplateOpen(false);
    } catch {
      toast.error(t.backupError);
    } finally {
      setTemplatePending(false);
    }
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
          <DropdownMenuItem onClick={() => setTemplateOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            {t.createFromTemplate}
          </DropdownMenuItem>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            {t.settings}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAboutOpen(true)}>
            <Info className="mr-2 h-4 w-4" />
            {t.aboutLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Backup dialog */}
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
            <p className="text-xs text-muted-foreground">{t.importWarning}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template dialog */}
      <StarterTemplateDialog
        open={templateOpen}
        templates={getStarterTemplates(lang)}
        pending={templatePending}
        onConfirm={handleTemplateConfirm}
        onSkip={() => setTemplateOpen(false)}
      />

      {/* About dialog */}
      <WelcomeDialog open={aboutOpen} onContinue={() => setAboutOpen(false)} dismissible />
    </>
  );
}
