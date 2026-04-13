import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { WeightUnitProvider } from "@/hooks/use-weight-unit.tsx";
import { ExpiryDaysProvider } from "@/hooks/use-expiry-days.tsx";
import Index from "./pages/Index.tsx";
import BagDetail from "./pages/BagDetail.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <WeightUnitProvider>
        <ExpiryDaysProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/bag/:id" element={<BagDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ExpiryDaysProvider>
      </WeightUnitProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
