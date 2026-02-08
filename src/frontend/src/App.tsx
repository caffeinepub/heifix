import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserRole } from './hooks/useRole';
import { Wrench, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthButton from './components/AuthButton';
import CreateTicketPage from './pages/CreateTicketPage';
import MyTicketsPage from './pages/MyTicketsPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import { useState } from 'react';
import { UserRole } from './backend';

function AppLayout() {
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isStaff = userRole === UserRole.admin;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate({ to: '/' })}>
              <img src="/assets/generated/repair-logo-realistic.dim_512x512.png" alt="Repair Service" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground">HEIFIX</h1>
                <p className="text-xs text-muted-foreground">Professional Phone Service</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => navigate({ to: '/create' })}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    New Repair
                  </button>
                  <button
                    onClick={() => navigate({ to: '/my-tickets' })}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    My Tickets
                  </button>
                  {isStaff && (
                    <button
                      onClick={() => navigate({ to: '/staff' })}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      Staff Dashboard
                    </button>
                  )}
                </>
              )}
              <AuthButton />
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-border pt-4">
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      navigate({ to: '/create' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
                  >
                    New Repair
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/my-tickets' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
                  >
                    My Tickets
                  </button>
                  {isStaff && (
                    <button
                      onClick={() => {
                        navigate({ to: '/staff' });
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
                    >
                      Staff Dashboard
                    </button>
                  )}
                </>
              )}
              <AuthButton />
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026. Built with love using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wrench size={16} />
              <span className="text-sm">Expert repairs you can trust</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-12">
        <img
          src="/assets/generated/hero-repair-realistic.dim_1600x600.png"
          alt="Phone Repair Service"
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
          <div className="container mx-auto px-8">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Professional Phone Repair Service
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
              Fast, reliable repairs for all major brands. Track your repair status in real-time.
            </p>
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate({ to: '/create' })}>
                Start a Repair Request
              </Button>
            ) : (
              <div className="text-muted-foreground">
                Please sign in to create a repair request
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Wrench className="text-primary" size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Expert Technicians</h3>
          <p className="text-muted-foreground">
            Certified professionals with years of experience in mobile device repair.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              className="text-primary"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
          <p className="text-muted-foreground">
            Transparent estimates with no hidden fees. You'll know the cost upfront.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              className="text-primary"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Quick Turnaround</h3>
          <p className="text-muted-foreground">
            Most repairs completed within 24-48 hours. Track progress online.
          </p>
        </div>
      </div>
    </div>
  );
}

// Router setup
const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const createRoute_ = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateTicketPage,
});

const myTicketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-tickets',
  component: MyTicketsPage,
});

const ticketDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ticket/$ticketId',
  component: TicketDetailsPage,
});

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: StaffDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  createRoute_,
  myTicketsRoute,
  ticketDetailsRoute,
  staffRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
