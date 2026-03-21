import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface StarterTemplateOption {
  id: string;
  icon: string;
  name: string;
  description: string;
  itemCount: number;
}

interface StarterTemplateDialogProps {
  open: boolean;
  templates: StarterTemplateOption[];
  pending?: boolean;
  onConfirm: (templateId: string) => void;
  onSkip: () => void;
}

export function StarterTemplateDialog({ open, templates, pending = false, onConfirm, onSkip }: StarterTemplateDialogProps) {
  const { t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0]?.id ?? "");

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !pending) onSkip();
      }}
    >
      <DialogContent
        className="sm:max-w-xl"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t.starterTemplatesTitle}</DialogTitle>
          <DialogDescription>{t.starterTemplatesDescription}</DialogDescription>
        </DialogHeader>

        <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="gap-3">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.id;

            return (
              <Label key={template.id} htmlFor={`starter-${template.id}`} className="cursor-pointer">
                <Card className={cn("transition-colors", isSelected && "border-primary bg-accent/40") }>
                  <CardContent className="flex items-start gap-3 p-4">
                    <RadioGroupItem id={`starter-${template.id}`} value={template.id} className="mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" aria-hidden="true">{template.icon}</span>
                        <span className="font-medium text-foreground">{template.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <p className="text-xs text-muted-foreground">{t.starterTemplateItems(template.itemCount)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            );
          })}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={onSkip} disabled={pending}>{t.starterTemplatesSkip}</Button>
          <Button onClick={() => onConfirm(selectedTemplate)} disabled={pending || !selectedTemplate}>{t.starterTemplatesConfirm}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}