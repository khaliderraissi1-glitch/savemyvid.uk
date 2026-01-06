
import React, { useState } from 'react';

interface UrlInputProps {
  onFetch: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onFetch, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onFetch(url.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
          The UK's Leading <span className="text-red-600">Video Downloader</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Convert and download any video from the web in high-quality MP4 or MP3 format. 
          Powered by Gemini AI for smart content analysis.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col md:flex-row items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="hidden md:flex pl-6 items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656-1.1 1.1" />
            </svg>
          </div>
          <input
            type="url"
            className="w-full flex-1 bg-transparent px-6 py-5 text-lg outline-none text-white placeholder-slate-500"
            placeholder="Paste your video URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto md:mr-2 px-10 py-4 md:py-3 rounded-lg font-black text-white transition-all uppercase tracking-widest ${
              isLoading 
              ? 'bg-slate-800 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-500 active:scale-95 shadow-lg shadow-red-600/20'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              'Download Now'
            )}
          </button>
        </div>
      </form>
      <p className="mt-4 text-center text-xs text-slate-500">
        By using <span className="text-slate-400 font-semibold">savemyvid.uk</span>, you agree to our UK Fair Use Policy.
      </p>
    </div>
  );
};

export default UrlInput;
