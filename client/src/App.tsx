import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import Catalog from "./pages/Catalog";
import Clients from "./pages/Clients";
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import SystemLanding from "./pages/SystemLanding";
import Team from "./pages/Team";

function Router() {
  const isSystem = window.location.pathname === "/sistema" || window.location.pathname.startsWith("/sistema/");
  const base = isSystem ? "/sistema" : "";

  return (
    <WouterRouter base={base}>
      <Switch>
        <Route path="/" component={isSystem ? SystemLanding : Home} />
        <Route path="/catalogo" component={Catalog} />
        <Route path="/clientes" component={Clients} />
        <Route path="/imovel/:id" component={PropertyDetail} />
        <Route path="/equipe" component={Team} />
        <Route path="/admin" component={Admin} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
