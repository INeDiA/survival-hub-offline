import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Globe, Weight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { useWeightUnit } from "@/hooks/use-weight-unit";
import { useExpiryDays } from "@/hooks/use-expiry-days";

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { lang, t, setLang } = useLanguage();
  const { unit, setUnit } = useWeightUnit();
  const { expiryWarningDays, setExpiryWarningDays } = useExpiryDays();

  const expiryOptions = [14, 30, 60, 90];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{t.settings}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 pt-6 pb-24">
        {/* Theme */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {t.themeLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => theme === "dark" && toggle()}
              >
                <Sun className="mr-2 h-4 w-4" /> {t.lightTheme}
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => theme === "light" && toggle()}
              >
                <Moon className="mr-2 h-4 w-4" /> {t.darkTheme}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              {t.languageLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={lang === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLang("en")}
              >
                English
              </Button>
              <Button
                variant={lang === "it" ? "default" : "outline"}
                size="sm"
                onClick={() => setLang("it")}
              >
                Italiano
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weight unit */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Weight className="h-4 w-4" />
              {t.weightUnitLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={unit === "kg" ? "default" : "outline"}
                size="sm"
                onClick={() => setUnit("kg")}
              >
                Kg
              </Button>
              <Button
                variant={unit === "lbs" ? "default" : "outline"}
                size="sm"
                onClick={() => setUnit("lbs")}
              >
                {t.lbsLabel}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expiry warning */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              {t.expiryWarningLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {expiryOptions.map((d) => (
                <Button
                  key={d}
                  variant={expiryWarningDays === d ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExpiryWarningDays(d)}
                >
                  {t.expiryWarningDaysLabel(d)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
