import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AuthButton() {
  const { login, clear, loginStatus, identity, loginError } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const isError = loginStatus === 'loginError';

  const handleAuth = () => {
    if (isAuthenticated) {
      clear();
      queryClient.clear();
    } else {
      login();
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleAuth}
        disabled={disabled}
        variant={isAuthenticated ? 'outline' : 'default'}
        size="sm"
      >
        {loginStatus === 'logging-in' ? (
          'Signing in...'
        ) : isAuthenticated ? (
          <>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </>
        ) : (
          <>
            <LogIn size={16} className="mr-2" />
            Sign In
          </>
        )}
      </Button>
      
      {isError && (
        <Alert variant="destructive" className="max-w-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {loginError?.message || 'Login failed. Please try again.'}
            <Button
              variant="link"
              size="sm"
              onClick={handleAuth}
              className="ml-2 h-auto p-0 text-destructive underline"
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
