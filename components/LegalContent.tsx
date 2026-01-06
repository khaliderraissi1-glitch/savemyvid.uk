
import React from 'react';
import { View } from '../types';

interface LegalContentProps {
  view: View;
  onBack: () => void;
}

const LegalContent: React.FC<LegalContentProps> = ({ view, onBack }) => {
  const renderContent = () => {
    switch (view) {
      case 'terms':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="text-slate-400">Last Updated: June 2025</p>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">1. Acceptance of Terms</h2>
              <p>By accessing savemyvid.uk, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">2. Permitted Use</h2>
              <p>Our tool is designed for personal, non-commercial use only. You may only download content for which you own the copyright or have explicit permission from the copyright holder.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">3. Prohibited Activities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Downloading copyrighted material without authorization.</li>
                <li>Using the service for automated scraping or bulk harvesting.</li>
                <li>Attempting to bypass any security measures or rate limits.</li>
              </ul>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">4. Disclaimer of Liability</h2>
              <p>TubeStream Pro is provided "as is". We are not responsible for how users utilize the tool or any copyright infringements committed by third parties.</p>
            </section>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-slate-400">Your privacy is our priority.</p>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">1. Data Collection</h2>
              <p>We do not store any personal data or download history on our servers. All video processing is ephemeral and metadata is used only during your active session.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">2. Cookies</h2>
              <p>We use essential cookies to maintain your session preferences. We do not use tracking or advertising cookies.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">3. Third-Party Services</h2>
              <p>Our service interacts with the YouTube API and Google Gemini API to provide metadata and intelligence. Please refer to their respective privacy policies.</p>
            </section>
          </div>
        );
      case 'legal':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Copyright & Legal Information</h1>
            <p className="text-slate-400">Important notices regarding intellectual property.</p>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">DMCA Compliance</h2>
              <p>If you are a copyright owner and believe that content accessible through our service infringes your rights, please contact our legal department. We respond to all valid DMCA notices within 48 hours.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">Fair Use</h2>
              <p>Under Section 107 of the Copyright Act, allowance is made for "fair use" for purposes such as criticism, comment, news reporting, teaching, scholarship, and research.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-200">Trademark Notice</h2>
              <p>YouTube is a trademark of Google LLC. savemyvid.uk is not affiliated with, endorsed by, or sponsored by Google or YouTube.</p>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-slate-400 hover:text-white transition-colors group"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default LegalContent;
