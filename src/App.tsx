import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Security, LoginCallback } from "@okta/okta-react";
import { toRelativeUrl } from "@okta/okta-auth-js";
import { oktaAuth } from "@/lib/oktaConfig";
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
import PoliciesGovernance from "./pages/PoliciesGovernance";
import ProjectCatalogue from "./pages/ProjectCatalogue";
import Toolbox from "./pages/Toolbox";
import AgentsRegistry from "./pages/AgentsRegistry";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { hydrateOktaDebugEvents, logOktaEvent } from "@/lib/oktaDebug";
import { initAnalytics } from "@/lib/analytics";
import { usePageTracking } from "@/hooks/usePageTracking";

hydrateOktaDebugEvents();
initAnalytics();
logOktaEvent("auth:frontend-initialized", {
  path: window.location.pathname,
  hasQuery: Boolean(window.location.search),
});

const queryClient = new QueryClient();

const AppContent = () => {
  usePageTracking();
  const navigate = useNavigate();

  // After Okta finishes the redirect, return the user to where they started.
  const restoreOriginalUri = async (_oktaAuth: unknown, originalUri: string) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), {
      replace: true,
    });
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <AuthProvider>
        <AgentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ScrollToTop />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/login/callback" element={<LoginCallback />} />
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
              <Route path="/policies-governance" element={<PoliciesGovernance />} />
              <Route path="/project-catalogue" element={<ProjectCatalogue />} />
              <Route path="/toolbox" element={<Toolbox />} />
              <Route path="/agents" element={<AgentsRegistry />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AgentProvider>
      </AuthProvider>
    </Security>
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