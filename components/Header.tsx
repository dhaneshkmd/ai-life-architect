
import React from 'react';
import { UserProfile } from '../types';
import { LogoIcon } from './icons/LogoIcon';

interface HeaderProps {
  userProfile: UserProfile | null;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, onReset }) => {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b-0">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-brand-primary" />
          <h1 className="text-xl font-bold text-brand-secondary">AI Life Architect</h1>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-brand-muted hover:text-brand-secondary transition-colors">
            Blog
          </a>
          {userProfile && (
            <div className="flex items-center gap-4">
              <span className="text-brand-muted hidden sm:block">Welcome, {userProfile.name}</span>
              <button
                onClick={onReset}
                className="px-3 py-1.5 text-sm font-semibold text-brand-secondary bg-brand-surface/50 border border-brand-border rounded-md hover:bg-brand-surface transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
