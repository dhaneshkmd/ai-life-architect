
import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import Spinner from './Spinner';

interface AuthProps {
    onLoginSuccess: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // Simulate API call
        setTimeout(() => {
            // In a real app, you'd have actual auth logic here.
            // For this demo, we'll just assume success if email is present.
            if (!email) {
                setError("Please enter a valid email.");
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
            onLoginSuccess(email);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <LogoIcon className="h-12 w-12 text-brand-primary mx-auto" />
                    <h1 className="text-3xl font-bold text-brand-secondary mt-4">AI Life Architect</h1>
                    <p className="text-brand-muted">Welcome to your future. Sign in to continue.</p>
                </div>

                <div className="glass-effect rounded-lg p-8 shadow-2xl">
                    <div className="flex border-b border-brand-border mb-6">
                        <button
                            onClick={() => setIsLoginView(true)}
                            className={`w-1/2 py-3 text-sm font-medium transition-colors ${isLoginView ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-muted hover:text-brand-secondary'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLoginView(false)}
                             className={`w-1/2 py-3 text-sm font-medium transition-colors ${!isLoginView ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-muted hover:text-brand-secondary'}`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                        {!isLoginView && (
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full input-glass rounded-md p-3 text-brand-secondary focus:outline-none"
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full input-glass rounded-md p-3 text-brand-secondary focus:outline-none"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full input-glass rounded-md p-3 text-brand-secondary focus:outline-none"
                        />

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 disabled:bg-gray-600 transition-all hover:shadow-brand-glow"
                        >
                            {isLoading ? <Spinner /> : (isLoginView ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
