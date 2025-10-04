import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { UserProfile, Pathway, NumerologyReport } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import Auth from './components/Auth';
import BackgroundArt from './components/BackgroundArt'; // <-- NEW

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [numerologyReport, setNumerologyReport] = useState<NumerologyReport | null>(null);
  const [isTosOpen, setIsTosOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleOnboardingComplete = (profile: UserProfile, generatedPathway: Pathway, report: NumerologyReport) => {
    setUserProfile(profile);
    setPathway(generatedPathway);
    setNumerologyReport(report);
  };

  const resetApp = () => {
    setUserProfile(null);
    setPathway(null);
    setNumerologyReport(null);
    setIsAuthenticated(false);
    setUserEmail('');
  };
  
  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const tosContent =
    "Placeholder for Terms of Service. This is where the full terms and conditions for using AI Life Architect would be displayed.";
  const privacyContent =
    "Placeholder for Privacy Policy. This section would detail how user data is collected, stored, and used, emphasizing the 'Private by Design' principles.";

  return (
    <div className="min-h-screen relative font-sans text-white flex flex-col">
      {/* Vivid, colorful backdrop */}
      <BackgroundArt />

      {/* Foreground app content */}
      <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
        {!isAuthenticated ? (
          <Auth onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <Header userProfile={userProfile} onReset={resetApp} />
            <main className="container mx-auto p-4 md:p-8 flex-grow">
              {!userProfile || !pathway || !numerologyReport ? (
                <Onboarding onComplete={handleOnboardingComplete} userEmail={userEmail} />
              ) : (
                <Dashboard userProfile={userProfile} pathway={pathway} numerologyReport={numerologyReport} />
              )}
            </main>
            <Footer onTosClick={() => setIsTosOpen(true)} onPrivacyClick={() => setIsPrivacyOpen(true)} />
          </>
        )}

        <Modal isOpen={isTosOpen} onClose={() => setIsTosOpen(false)} title="Terms of Service">
          <p className="text-brand-muted">{tosContent}</p>
        </Modal>
        <Modal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="Privacy Policy">
          <p className="text-brand-muted">{privacyContent}</p>
        </Modal>
      </div>
    </div>
  );
};

export default App;
