import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Input, Card } from '../components/Common';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('demo@tattva.ai');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(email);
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-slate-500">Sign in to TattvaAI Pro</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-600 dark:text-slate-400">
              <input type="checkbox" className="mr-2 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
              Remember me
            </label>
            <button type="button" className="text-purple-600 font-medium hover:text-purple-700">
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <button className="text-purple-600 font-bold hover:underline">
            Sign up for free
          </button>
        </div>
      </Card>
    </div>
  );
};