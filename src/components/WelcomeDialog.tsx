import { ShieldCheck, WifiOff, Download } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface WelcomeDialogProps {
  open: boolean;
  onContinue: () => void;
  dismissible?: boolean;
}

export function WelcomeDialog({ open, onContinue, dismissible = false }: WelcomeDialogProps) {
  const { t } = useLanguage();

  const features = [
    { icon: ShieldCheck, title: t.welcomePrivacyTitle, desc: t.welcomePrivacyDesc },
    { icon: WifiOff, title: t.welcomeOfflineTitle, desc: t.welcomeOfflineDesc },
    { icon: Download, title: t.welcomeExportTitle, desc: t.welcomeExportDesc },
  ];

  return (
    <Dialog open={open} onOpenChange={dismissible ? (v) => { if (!v) onContinue(); } : undefined}>
      <DialogContent
        className={cn("max-w-sm mx-auto p-6", !dismissible && "[&>button]:hidden")}
        onPointerDownOutside={dismissible ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={dismissible ? undefined : (e) => e.preventDefault()}
      >
        <div className="text-center mb-2">
          <h2 className="text-lg font-mono font-bold tracking-tight">{t.welcomeTitle}</h2>
        </div>

        <div className="space-y-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-3 rounded-lg border bg-muted/30">
              <Icon className="h-8 w-8 shrink-0 text-primary mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onContinue} className="w-full mt-2" size="lg">
          {t.welcomeContinue}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
