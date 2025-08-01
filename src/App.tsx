
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CanaisGratisPage from "./pages/ao-vivo-gratis";
import GloboAoVivo from "./pages/ao-vivo-gratis/globo-ao-vivo";
import SBTRJAoVivo from "./pages/ao-vivo-gratis/sbt-rj-ao-vivo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ao-vivo-gratis" element={<CanaisGratisPage />} />
          <Route path="/ao-vivo-gratis/globo-ao-vivo" element={<GloboAoVivo />} />
          <Route path="/ao-vivo-gratis/sbt-rj-ao-vivo" element={<SBTRJAoVivo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
