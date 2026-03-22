import { useEffect, useMemo, useState } from "react";
import { Copy, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useLanguage, useTranslatedCategories } from "@/hooks/use-language";
import {
  exportStarterTemplatesJson,
  getEditableStarterTemplates,
  resetStarterTemplateOverrides,
  saveStarterTemplateOverrides,
  type LocalizedText,
  type StarterTemplateDefinition,
  type StarterTemplateItem,
} from "@/lib/starter-templates";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface TemplateEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplatesUpdated: () => void;
}

const createEmptyLocalizedText = (): LocalizedText => ({ en: "", it: "" });

const createEmptyItem = (): StarterTemplateItem => ({
  name: createEmptyLocalizedText(),
  category: "other",
  weight: 0,
  quantity: 1,
  checked: false,
  notes: createEmptyLocalizedText(),
});

const textareaClassName = "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function TemplateEditorDialog({ open, onOpenChange, onTemplatesUpdated }: TemplateEditorDialogProps) {
  const { t } = useLanguage();
  const categories = useTranslatedCategories();
  const { toast } = useToast();
  const [draft, setDraft] = useState<StarterTemplateDefinition[]>(() => getEditableStarterTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState(draft[0]?.id ?? "");

  useEffect(() => {
    if (!open) return;

    const nextTemplates = getEditableStarterTemplates();
    setDraft(nextTemplates);
    setSelectedTemplateId((current) => nextTemplates.some((template) => template.id === current) ? current : (nextTemplates[0]?.id ?? ""));
  }, [open]);

  const selectedTemplate = useMemo(() => draft.find((template) => template.id === selectedTemplateId) ?? draft[0], [draft, selectedTemplateId]);

  const updateSelectedTemplate = (updater: (template: StarterTemplateDefinition) => StarterTemplateDefinition) => {
    setDraft((current) => current.map((template) => (template.id === selectedTemplateId ? updater(template) : template)));
  };

  const updateLocalizedField = (field: "bagName" | "summary" | "bagDescription", lang: keyof LocalizedText, value: string) => {
    updateSelectedTemplate((template) => ({
      ...template,
      [field]: {
        ...template[field],
        [lang]: value,
      },
    }));
  };

  const updateItem = (index: number, updater: (item: StarterTemplateItem) => StarterTemplateItem) => {
    updateSelectedTemplate((template) => ({
      ...template,
      items: template.items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item)),
    }));
  };

  const handleSave = () => {
    saveStarterTemplateOverrides(draft);
    onTemplatesUpdated();
    toast({ title: t.templateEditorSaveDone });
  };

  const handleReset = () => {
    resetStarterTemplateOverrides();
    const nextTemplates = getEditableStarterTemplates();
    setDraft(nextTemplates);
    setSelectedTemplateId(nextTemplates[0]?.id ?? "");
    onTemplatesUpdated();
    toast({ title: t.templateEditorResetDone });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportStarterTemplatesJson(draft));
      toast({ title: t.templateEditorCopyDone });
    } catch {
      toast({ title: t.templateEditorCopyFailed, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{t.templateEditorTitle}</DialogTitle>
          <DialogDescription>{t.templateEditorDescription}</DialogDescription>
          <p className="text-xs text-muted-foreground">{t.templateEditorPreviewOnly}</p>
        </DialogHeader>

        <div className="grid min-h-0 gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-2">
            {draft.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplateId(template.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  selectedTemplate?.id === template.id ? "border-primary bg-accent/40" : "bg-card hover:bg-accent/20",
                )}
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{template.icon}</span>
                  <span className="font-medium text-foreground">{template.bagName.it || template.bagName.en || template.id}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{t.starterTemplateItems(template.items.length)}</p>
              </button>
            ))}
          </div>

          {selectedTemplate && (
            <div className="max-h-[62vh] space-y-4 overflow-y-auto pr-1">
              <Card>
                <CardContent className="space-y-4 p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label={t.templateEditorIcon}>
                      <Input value={selectedTemplate.icon} onChange={(event) => updateSelectedTemplate((template) => ({ ...template, icon: event.target.value }))} />
                    </Field>
                    <Field label={t.weightLimit}>
                      <Input type="number" min={0} value={selectedTemplate.weightLimit} onChange={(event) => updateSelectedTemplate((template) => ({ ...template, weightLimit: Math.max(0, Number(event.target.value) || 0) }))} />
                    </Field>
                    <Field label={t.bagWeight}>
                      <Input type="number" min={0} value={selectedTemplate.bagWeight} onChange={(event) => updateSelectedTemplate((template) => ({ ...template, bagWeight: Math.max(0, Number(event.target.value) || 0) }))} />
                    </Field>
                  </div>

                  <LocalizedFields enLabel={t.templateEditorNameEn} itLabel={t.templateEditorNameIt} values={selectedTemplate.bagName} onChange={(lang, value) => updateLocalizedField("bagName", lang, value)} />
                  <LocalizedFields enLabel={t.templateEditorSummaryEn} itLabel={t.templateEditorSummaryIt} values={selectedTemplate.summary} onChange={(lang, value) => updateLocalizedField("summary", lang, value)} multiline />
                  <LocalizedFields enLabel={t.templateEditorDescriptionEn} itLabel={t.templateEditorDescriptionIt} values={selectedTemplate.bagDescription} onChange={(lang, value) => updateLocalizedField("bagDescription", lang, value)} multiline />
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">{t.items}</h3>
                <Button variant="outline" size="sm" onClick={() => updateSelectedTemplate((template) => ({ ...template, items: [...template.items, createEmptyItem()] }))}>
                  <Plus className="h-4 w-4" /> {t.templateEditorAddItem}
                </Button>
              </div>

              <div className="space-y-3">
                {selectedTemplate.items.map((item, index) => (
                  <Card key={`${selectedTemplate.id}-${index}`}>
                    <CardContent className="space-y-4 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                          <span>{t.templateEditorItemLabel(index + 1)}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => updateSelectedTemplate((template) => ({ ...template, items: template.items.filter((_, itemIndex) => itemIndex !== index) }))}>
                          <Trash2 className="h-4 w-4" /> {t.templateEditorRemoveItem}
                        </Button>
                      </div>

                      <LocalizedFields enLabel={t.templateEditorNameEn} itLabel={t.templateEditorNameIt} values={item.name} onChange={(lang, value) => updateItem(index, (current) => ({ ...current, name: { ...current.name, [lang]: value } }))} />

                      <div className="grid gap-4 md:grid-cols-4">
                        <Field label={t.category}>
                          <select
                            value={item.category}
                            onChange={(event) => updateItem(index, (current) => ({ ...current, category: event.target.value as StarterTemplateItem["category"] }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            {categories.map((category) => (
                              <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label={t.weight}>
                          <Input type="number" min={0} value={item.weight} onChange={(event) => updateItem(index, (current) => ({ ...current, weight: Math.max(0, Number(event.target.value) || 0) }))} />
                        </Field>
                        <Field label={t.quantity}>
                          <Input type="number" min={1} value={item.quantity} onChange={(event) => updateItem(index, (current) => ({ ...current, quantity: Math.max(1, Number(event.target.value) || 1) }))} />
                        </Field>
                        <label className="mt-6 flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
                          <input type="checkbox" checked={item.checked} onChange={(event) => updateItem(index, (current) => ({ ...current, checked: event.target.checked }))} className="h-4 w-4 rounded border-input" />
                          <span>{t.alreadyInBag}</span>
                        </label>
                      </div>

                      <LocalizedFields
                        enLabel={t.templateEditorNotesEn}
                        itLabel={t.templateEditorNotesIt}
                        values={item.notes ?? createEmptyLocalizedText()}
                        onChange={(lang, value) => updateItem(index, (current) => ({
                          ...current,
                          notes: {
                            ...(current.notes ?? createEmptyLocalizedText()),
                            [lang]: value,
                          },
                        }))}
                        multiline
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}><RotateCcw className="h-4 w-4" /> {t.templateEditorReset}</Button>
          <Button variant="outline" onClick={handleCopy}><Copy className="h-4 w-4" /> {t.templateEditorCopy}</Button>
          <Button onClick={handleSave}>{t.templateEditorSave}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function LocalizedFields({
  enLabel,
  itLabel,
  values,
  onChange,
  multiline = false,
}: {
  enLabel: string;
  itLabel: string;
  values: LocalizedText;
  onChange: (lang: keyof LocalizedText, value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label={enLabel}>
        {multiline ? <textarea className={textareaClassName} value={values.en} onChange={(event) => onChange("en", event.target.value)} /> : <Input value={values.en} onChange={(event) => onChange("en", event.target.value)} />}
      </Field>
      <Field label={itLabel}>
        {multiline ? <textarea className={textareaClassName} value={values.it} onChange={(event) => onChange("it", event.target.value)} /> : <Input value={values.it} onChange={(event) => onChange("it", event.target.value)} />}
      </Field>
    </div>
  );
}
