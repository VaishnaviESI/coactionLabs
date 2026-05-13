import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AgentProvider } from "@/contexts/AgentContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import AgentDetail from "./pages/AgentDetail";
import Academy from "./pages/Academy";
import MyAgents from "./pages/MyAgents";
import Analytics from "./pages/Analytics";
import AskExpert from "./pages/AskExpert";
import CreateAgent from "./pages/CreateAgent";
import MyAgentDetail from "./pages/MyAgentDetail";
import MyTeamsAgents from "./pages/MyTeamsAgents";
import CertificationQueue from "./pages/CertificationQueue";
import IdeasWorkshop from "./pages/IdeasWorkshop";
import PoliciesGovernance from "./pages/PoliciesGovernance";
import ProjectCatalogue from "./pages/ProjectCatalogue";
import Toolbox from "./pages/Toolbox";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { hydrateOktaDebugEvents, logOktaEvent } from "@/lib/oktaDebug";

hydrateOktaDebugEvents();
logOktaEvent("auth:frontend-initialized", {
  path: window.location.pathname,
  hasQuery: Boolean(window.location.search),
});

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <AuthProvider>
      <AgentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/agent/:id" element={<AgentDetail />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/my-agents" element={<MyAgents />} />
            <Route path="/my-agents/:id" element={<MyAgentDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ask-expert" element={<AskExpert />} />
            <Route path="/create-agent" element={<CreateAgent />} />
            <Route path="/team-agents" element={<MyTeamsAgents />} />
            <Route path="/certification-queue" element={<CertificationQueue />} />
            <Route path="/ideas-workshop" element={<IdeasWorkshop />} />
            <Route path="/policies-governance" element={<PoliciesGovernance />} />
            <Route path="/project-catalogue" element={<ProjectCatalogue />} />
            <Route path="/toolbox" element={<Toolbox />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AgentProvider>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;