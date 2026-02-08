import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, login, loginStatus, loginError } = useInternetIdentity();

  const isError = loginStatus === 'loginError';

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
          
          {isError && (
            <Alert variant="destructive" className="mb-6 text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>
                {loginError?.message || 'Unable to sign in. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={login} 
            disabled={loginStatus === 'logging-in'} 
            size="lg"
            className="mb-6"
          >
            {loginStatus === 'logging-in' ? 'Signing in...' : isError ? 'Try Again' : 'Sign In'}
          </Button>

          <Alert className="text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>Troubleshooting</AlertTitle>
            <AlertDescription className="text-sm space-y-1">
              <p>If you're having trouble signing in:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Make sure pop-ups are enabled for this site</li>
                <li>Allow third-party cookies for the identity provider</li>
                <li>Try disabling browser extensions that block pop-ups</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
