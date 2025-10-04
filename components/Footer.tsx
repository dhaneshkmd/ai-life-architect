
import React from 'react';

interface FooterProps {
  onTosClick: () => void;
  onPrivacyClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onTosClick, onPrivacyClick }) => {
  return (
    <footer className="bg-transparent border-t border-brand-border print-hide">
      <div className="container mx-auto flex items-center justify-between p-4 text-sm text-brand-muted">
        <p>&copy; {new Date().getFullYear()} AI Life Architect. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <button onClick={onTosClick} className="hover:text-brand-secondary transition-colors">Terms of Service</button>
          <button onClick={onPrivacyClick} className="hover:text-brand-secondary transition-colors">Privacy Policy</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
