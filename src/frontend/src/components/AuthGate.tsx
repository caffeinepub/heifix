import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, login, loginStatus } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access this feature and manage your repair tickets.
          </p>
          <Button onClick={login} disabled={loginStatus === 'logging-in'} size="lg">
            {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
