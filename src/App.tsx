import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ComingSoon from "@/pages/ComingSoon";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about">
            <ComingSoon title="About Us" />
          </Route>
          <Route path="/services">
            <ComingSoon title="Services" />
          </Route>
          <Route path="/works">
            <ComingSoon title="Our Works" />
          </Route>
          <Route path="/careers">
            <ComingSoon title="Careers" />
          </Route>
          <Route path="/blogs">
            <ComingSoon title="Blogs" />
          </Route>
          <Route path="/contact">
            <ComingSoon title="Contact Us" />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
