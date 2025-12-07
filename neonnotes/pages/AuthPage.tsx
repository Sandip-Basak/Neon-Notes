import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, extractErrorMessage } from '../services/api';
import { Button, Input } from '../components/UI';
import { KeyRound, Sparkles } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login(username, password);
        login(response.token, { id: response.user_id, username: response.username });
      } else {
        await authService.register(username, password);
        // Auto login after register or ask user to login? 
        // Let's perform login automatically for better UX
        const response = await authService.login(username, password);
        login(response.token, { id: response.user_id, username: response.username });
      }
    } catch (err) {
      setError(extractErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[60%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-surface/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-4 shadow-lg shadow-indigo-500/25">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              {isLogin ? 'Enter your credentials to access your notes' : 'Join NeonNotes and organize your thoughts'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={loading}>
              <KeyRound className="w-4 h-4 mr-2" />
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setUsername('');
                  setPassword('');
                }}
                className="text-primary hover:text-indigo-400 font-medium transition-colors"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
