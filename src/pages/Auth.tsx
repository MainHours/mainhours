
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";
import { Check } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Successfully logged in!');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success('Registration successful! Please check your email to confirm your account.');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      // No need for toast success here as we're being redirected
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? 'Sign in to your account to continue' : 'Create a new account'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                {isLogin && (
                  <button type="button" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder={isLogin ? "Enter your password" : "Choose a strong password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {isLogin && (
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-4 h-4 border rounded flex items-center justify-center cursor-pointer ${rememberMe ? 'bg-primary border-primary' : 'border-gray-300'}`}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && <Check className="h-3 w-3 text-white" />}
                </div>
                <label 
                  htmlFor="remember-me" 
                  className="text-sm text-muted-foreground cursor-pointer"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  Remember me
                </label>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 h-11 border-gray-300"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <rect x="9" y="9" width="6" height="6" fill="red"></rect>
            </svg>
            Sign in with Google
          </Button>
          
          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
