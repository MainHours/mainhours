import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        alert('Logged in successfully!');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registration successful! Check your email.');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 6 }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
          style={{ padding: 8, fontSize: 16 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          style={{ padding: 8, fontSize: 16 }}
        />
        {isLogin && (
          <label style={{ userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              style={{ marginRight: 8 }}
            />
            Remember me {rememberMe && '✔️'}
          </label>
        )}
        <button type="submit" disabled={isLoading} style={{ padding: 10, fontSize: 16 }}>
          {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <hr style={{ margin: '1.5rem 0' }} />

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, marginBottom: 10, cursor: 'pointer' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M21.35 11.1h-9.5v2.9h6.85c-.3 1.7-2.2 5-6.85 5-4.15 0-7.55-3.4-7.55-7.6s3.4-7.6 7.55-7.6c2.35 0 3.9 1 4.8 1.8l2.9-2.85c-1.75-1.6-4-2.6-7.7-2.6-6.5 0-11.8 5.3-11.8 11.8s5.3 11.8 11.8 11.8c6.8 0 11.2-4.75 11.2-11.5 0-.75-.1-1.25-.3-1.65z"/>
        </svg>
        Sign in with Google
      </button>

      <button
        onClick={handleMicrosoftLogin}
        disabled={isLoading}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, cursor: 'pointer', backgroundColor: '#2F2F2F', color: 'white', border: 'none' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect x="1" y="1" width="10" height="10" fill="#F35325" />
          <rect x="13" y="1" width="10" height="10" fill="#81BC06" />
          <rect x="1" y="13" width="10" height="10" fill="#05A6F0" />
          <rect x="13" y="13" width="10" height="10" fill="#FFBA08" />
        </svg>
        Sign in with Microsoft
      </button>

      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue', background: 'none', border: 'none', padding: 0 }}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </p>
    </div>
  );
};

export default Auth;

