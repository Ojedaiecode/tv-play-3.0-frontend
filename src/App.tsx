
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CanaisGratisPage from "./pages/ao-vivo-gratis";
import GloboAoVivo from "./pages/ao-vivo-gratis/globo-ao-vivo";
import SBTRJAoVivo from "./pages/ao-vivo-gratis/sbt-rj-ao-vivo";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/ao-vivo-gratis" element={
              <PrivateRoute>
                <CanaisGratisPage />
              </PrivateRoute>
            } />
            <Route path="/ao-vivo-gratis/globo-ao-vivo" element={
              <PrivateRoute>
                <GloboAoVivo />
              </PrivateRoute>
            } />
            <Route path="/ao-vivo-gratis/sbt-rj-ao-vivo" element={
              <PrivateRoute>
                <SBTRJAoVivo />
              </PrivateRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
