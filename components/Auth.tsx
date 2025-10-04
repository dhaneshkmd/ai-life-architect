import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import Spinner from './Spinner';

interface AuthProps {
  onLoginSuccess: (email: string) => void;
}

/** --- Self-typing headline (no dependency) --- */
const HeroTyping: React.FC = () => {
  const lines = [
    'Welcome to AI Life Architect...',
    'Craft your future, one choice at a time.',
    'Discover your Life Path & hidden potential.',
    'Simulate career, finance, health, and destiny.',
    'Design the life you dream of — with AI by your side.',
  ];

  const [i, setI] = useState(0);           // which line
  const [text, setText] = useState('');    // visible text
  const [del, setDel] = useState(false);   // deleting?
  const [speed, setSpeed] = useState(50);  // typing speed

  useEffect(() => {
    const full = lines[i];
    if (!del && text.length < full.length) {
      setSpeed(28); // typing
      const t = setTimeout(() => setText(full.slice(0, text.length + 1)), speed);
      return () => clearTimeout(t);
    }
    if (!del && text.length === full.length) {
      const t = setTimeout(() => setDel(true), 1500); // pause at end
      return () => clearTimeout(t);
    }
    if (del && text.length > 0) {
      setSpeed(16); // deleting
      const t = setTimeout(() => setText(full.slice(0, text.length - 1)), speed);
      return () => clearTimeout(t);
    }
    if (del && text.length === 0) {
      const t = setTimeout(() => {
        setDel(false);
        setI((prev) => (prev + 1) % lines.length);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [text, del, i]);

  return (
    <div className="mx-auto mb-8 max-w-3xl text-center px-2">
      <p className="text-xl md:text-2xl font-semibold text-white/95">
        {text}
        <span className="ml-1 inline-block w-[0.6ch] animate-pulse">|</span>
      </p>
    </div>
  );
};
/** ------------------------------------------- */

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password || (!isLoginView && !fullName)) {
      setError('Please fill all required fields.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 1000);
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-4">
          <LogoIcon className="h-12 w-12 text-brand-primary mx-auto" />
          <h1 className="text-3xl font-bold text-white mt-4">AI Life Architect</h1>
          <p className="text-white/70">Welcome to your future. Sign in to continue.</p>
        </div>

        {/* 🔥 Self-typing teaser */}
        <HeroTyping />

        {/* Glass Card */}
        <div className="relative rounded-2xl p-8 shadow-2xl backdrop-blur-xl bg-white/5 ring-1 ring-white/10">
          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-6" role="tablist" aria-label="Auth tabs">
            <button
              role="tab"
              aria-selected={isLoginView}
              onClick={() => setIsLoginView(true)}
              className={`w-1/2 py-3 text-sm font-medium transition-colors ${
                isLoginView
                  ? 'text-brand-primary border-b-2 border-brand-primary'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              role="tab"
              aria-selected={!isLoginView}
              onClick={() => setIsLoginView(false)}
              className={`w-1/2 py-3 text-sm font-medium transition-colors ${
                !isLoginView
                  ? 'text-brand-primary border-b-2 border-brand-primary'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <div>
                <label htmlFor="fullName" className="sr-only">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full input-glass rounded-md p-3 text-white placeholder-white/60 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full input-glass rounded-md p-3 text-white placeholder-white/60 focus:outline-none"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full input-glass rounded-md p-3 pr-12 text-white placeholder-white/60 focus:outline-none"
                autoComplete={isLoginView ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto text-white/70 hover:text-white px-2 text-sm"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-white/80">Remember me</span>
              </label>
              <a className="text-brand-primary hover:text-blue-400" href="#" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-6 py-3 text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 disabled:bg-gray-600 transition-all hover:shadow-brand-glow"
            >
              {isLoading ? <Spinner /> : isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
