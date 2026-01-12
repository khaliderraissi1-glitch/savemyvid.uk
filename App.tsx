
import React, { useState, useCallback } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import VideoPreview from './components/VideoPreview';
import DownloadOptions from './components/DownloadOptions';
import JobsList from './components/JobsList';
import LegalContent from './components/LegalContent';
import { AppStatus, VideoMetadata, DownloadFormat, DownloadJob, View } from './types';
import { fetchVideoIntelligence } from './services/geminiService';
import { fetchVideoInfo, getDownloadUrl } from './services/videoService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [realFormats, setRealFormats] = useState<DownloadFormat[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [jobs, setJobs] = useState<DownloadJob[]>([]);

  const handleFetch = useCallback(async (url: string) => {
    setStatus(AppStatus.FETCHING);
    setCurrentUrl(url);
    
    try {
      const realData = await fetchVideoInfo(url);
      const intel = await fetchVideoIntelligence(url);
      
      const videoMetadata: VideoMetadata = {
        title: realData.title || intel.title || "Video Analysis Result",
        author: realData.author || "SaveMyVid UK AI",
        thumbnail: realData.thumbnail || `https://picsum.photos/seed/${Math.random()}/1280/720`,
        duration: realData.duration || intel.duration || "0:00",
        views: realData.views || "1.2M",
        description: realData.description || "Intelligently analyzed content for UK users.",
        publishDate: new Date().toLocaleDateString('en-GB'),
        summary: intel.summary
      };

      setMetadata(videoMetadata);
      setRealFormats(realData.formats);
      setStatus(AppStatus.READY);
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus(AppStatus.ERROR);
      alert(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  }, []);

  const handleStartDownload = (format: DownloadFormat) => {
    if (!metadata || !currentUrl) return;

    const downloadUrl = getDownloadUrl(currentUrl, format.id, metadata.title);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const newJob: DownloadJob = {
      id: Math.random().toString(36).substr(2, 9),
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      progress: 0,
      status: 'downloading',
      format: `${format.quality} ${format.format}`,
      size: format.size
    };

    setJobs(prev => [newJob, ...prev]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setJobs(prev => prev.map(j => 
          j.id === newJob.id ? { ...j, progress: 100, status: 'completed' } : j
        ));
        setTimeout(() => {
          setJobs(prev => prev.filter(j => j.id !== newJob.id));
        }, 8000);
      } else {
        setJobs(prev => prev.map(j => 
          j.id === newJob.id ? { ...j, progress: currentProgress } : j
        ));
      }
    }, 800);
  };

  const renderHome = () => (
    <>
      <UrlInput onFetch={handleFetch} isLoading={status === AppStatus.FETCHING} />

      {status === AppStatus.READY && metadata && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <VideoPreview metadata={metadata} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <DownloadOptions 
              onStartDownload={handleStartDownload} 
              availableFormats={realFormats.length > 0 ? realFormats : undefined}
            />
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2">UK Legal Compliance</h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                SaveMyVid.uk operates strictly within the framework of UK copyright law. Our tool is intended for personal archiving, educational use, and fair use scenarios as outlined by British intellectual property standards.
              </p>
              <button 
                onClick={() => setCurrentView('terms')}
                className="text-red-500 text-xs font-bold uppercase tracking-widest hover:underline"
              >
                Full UK Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      )}

      {status === AppStatus.IDLE && (
        <>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Fastest UK Servers', desc: 'Our infrastructure is strategically located in London and Manchester to provide the lowest latency for UK users.', icon: '🇬🇧' },
              { title: 'Gemini AI Intelligence', desc: 'We utilize Google Gemini 3 Flash to intelligently analyze, summarize, and categorize video content before you download.', icon: '🧠' },
              { title: 'Unmatched HD Quality', desc: 'Support for full 4K UHD, 1080p Crystal Clear, and 320kbps High-Bitrate MP3 audio formats.', icon: '📺' }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-red-600/50 transition-all group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                <h4 className="text-xl font-black mb-3 text-white tracking-tight">{feature.title}</h4>
                <p className="text-slate-500 text-base leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* New SEO Section: Step by Step Guide */}
          <section className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">How to Download Videos with SaveMyVid.uk</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">The easiest way to save your favourite content for offline viewing in the United Kingdom.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Copy URL", desc: "Go to YouTube, Vimeo, or any supported site and copy the video's web address from the browser." },
                { step: "02", title: "Paste & Analyze", desc: "Paste the link into our secure input field. Our Gemini AI will automatically fetch the video's metadata." },
                { step: "03", title: "Select Format", desc: "Choose between MP4 video or MP3 audio. Select your preferred resolution like 720p, 1080p, or 4K." },
                { step: "04", title: "Get Your File", desc: "Click Download. Our high-speed UK servers will process the file and deliver it straight to your device." }
              ].map((item, idx) => (
                <div key={idx} className="relative p-8 bg-slate-900/30 border border-slate-800 rounded-2xl">
                  <span className="text-6xl font-black text-slate-800/50 absolute top-4 right-4">{item.step}</span>
                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* New SEO Section: FAQ */}
          <section className="mt-32 max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is SaveMyVid.uk free to use?", a: "Yes, our video downloader is 100% free for all users in the UK. We do not require registration or credit card details." },
                { q: "Can I download YouTube videos to MP3?", a: "Absolutely. Our converter supports high-quality audio extraction. Simply paste the link and select the 'Audio Only' tab." },
                { q: "Is it legal to download videos in the UK?", a: "Downloading copyrighted content without permission is generally against the terms of service of most platforms. However, UK law allows for 'Fair Dealing' for purposes of research, private study, criticism, review, and news reporting. Always ensure you have the right to download the content." },
                { q: "Does SaveMyVid support 4K resolution?", a: "Yes, if the source video is available in 4K, our system will offer the highest possible quality for download." },
                { q: "Is the service compatible with mobile devices?", a: "SaveMyVid.uk is fully responsive and works perfectly on iPhone, iPad, and Android devices using any modern mobile browser." }
              ].map((faq, idx) => (
                <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                  <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="mt-32 py-16 border-t border-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tight">The UK's Trusted Media Utility</h2>
          <p className="text-slate-400 text-sm mb-12 leading-relaxed italic">
            "Whether you're a student in Edinburgh, a creator in London, or a researcher in Cardiff, SaveMyVid.uk provides the tools you need to manage digital media effectively."
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            <div className="space-y-3">
              <h3 className="font-bold text-red-500">Free Forever</h3>
              <p className="text-slate-400 text-sm">No subscriptions, no hidden fees. SaveMyVid.uk is the UK's preferred free media conversion utility for thousands of daily users.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-red-500">Safe & Secure</h3>
              <p className="text-slate-400 text-sm">Your privacy is paramount. We don't store your files on our servers longer than necessary for the stream. All data is served via SSL encryption.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-red-500">No Installation</h3>
              <p className="text-slate-400 text-sm">Unlike messy browser extensions or dangerous desktop software, SaveMyVid works entirely in your web browser for maximum security.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-red-500">Local Support</h3>
              <p className="text-slate-400 text-sm">Optimized specifically for the UK digital landscape, ensuring fast access from BT, Sky, Virgin Media, and other major ISPs.</p>
            </div>
          </div>
        </div>
      </section>

      {status === AppStatus.ERROR && (
        <div className="mt-12 p-8 rounded-2xl bg-red-900/20 border border-red-800 text-center max-w-2xl mx-auto">
          <p className="text-red-500 font-bold mb-2">Oops! Something went wrong.</p>
          <p className="text-slate-400 text-sm mb-4">We couldn't process that URL. Please ensure it's a valid YouTube or Vimeo link and try again. Our servers might be experiencing high traffic from the UK region.</p>
          <button onClick={() => setStatus(AppStatus.IDLE)} className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold">Try Another URL</button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 pb-24">
        {currentView === 'home' ? renderHome() : (
          <LegalContent view={currentView} onBack={() => setCurrentView('home')} />
        )}
      </main>

      <JobsList jobs={jobs} />

      <footer className="border-t border-slate-900 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 mb-12">
            <div className="space-y-4">
              <button onClick={() => setCurrentView('home')} className="text-2xl font-black tracking-tighter text-white">
                savemyvid<span className="text-red-600">.uk</span>
              </button>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The UK's most reliable high-definition video downloading and AI analysis tool. Designed for speed, privacy, and simplicity.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h5 className="text-white font-bold text-sm uppercase tracking-widest">Legal Information</h5>
                <nav className="flex flex-col space-y-2 text-slate-500 text-sm">
                  <button onClick={() => setCurrentView('privacy')} className="text-left hover:text-white transition-colors">UK Privacy Policy</button>
                  <button onClick={() => setCurrentView('terms')} className="text-left hover:text-white transition-colors">Terms & Conditions</button>
                  <button onClick={() => setCurrentView('legal')} className="text-left hover:text-white transition-colors">Copyright / DMCA</button>
                </nav>
              </div>
              <div className="space-y-4">
                <h5 className="text-white font-bold text-sm uppercase tracking-widest">Resources</h5>
                <nav className="flex flex-col space-y-2 text-slate-500 text-sm">
                  <a href="#" className="hover:text-white">Help Centre</a>
                  <a href="#" className="hover:text-white">API Documentation</a>
                  <a href="#" className="hover:text-white">Supported Sites</a>
                </nav>
              </div>
              <div className="space-y-4 col-span-2 sm:col-span-1">
                <h5 className="text-white font-bold text-sm uppercase tracking-widest">Connect</h5>
                <nav className="flex flex-col space-y-2 text-slate-500 text-sm">
                  <a href="https://github.com/savemyvid" target="_blank" rel="noopener noreferrer" className="hover:text-white">Open Source</a>
                  <a href="#" className="hover:text-white">Official Twitter</a>
                  <a href="#" className="hover:text-white">Contact UK Team</a>
                </nav>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">
            <p>© 2025 SAVEMYVID.UK DIGITAL SOLUTIONS. OPERATED IN THE UNITED KINGDOM.</p>
            <p className="mt-4 sm:mt-0">SECURELY OPTIMIZED FOR ALL BRITISH NETWORK CARRIERS</p>
          </div>
        </div>
      </footer>
      <SpeedInsights />
    </div>
  );
};

export default App;
