
import React, { useState } from 'react';
import { DownloadFormat } from '../types';

interface DownloadOptionsProps {
  onStartDownload: (format: DownloadFormat) => void;
  availableFormats?: DownloadFormat[];
}

const defaultFormats: DownloadFormat[] = [
  { id: 'best', quality: 'Best Available', format: 'mp4', size: 'Varies', type: 'video' },
  { id: '137', quality: '1080p', format: 'mp4', size: 'High', type: 'video' },
  { id: 'bestaudio', quality: '320kbps', format: 'mp3', size: '10 MB', type: 'audio' },
];

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ onStartDownload, availableFormats }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const currentFormats = availableFormats || defaultFormats;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-4 text-sm font-bold transition-all ${
            activeTab === 'video' ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-4 text-sm font-bold transition-all ${
            activeTab === 'audio' ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Audio Only
        </button>
      </div>
      
      <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {currentFormats
          .filter((f) => f.type === activeTab)
          .map((format) => (
            <div
              key={format.id}
              className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                  {format.type === 'video' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white uppercase truncate max-w-[150px]">{format.quality} {format.format}</p>
                  <p className="text-xs text-slate-500 font-medium">{format.size}</p>
                </div>
              </div>
              <button
                onClick={() => onStartDownload(format)}
                className="px-6 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95"
              >
                Download
              </button>
            </div>
          ))}
        {currentFormats.filter((f) => f.type === activeTab).length === 0 && (
          <p className="text-center py-8 text-slate-500 text-sm italic">No {activeTab} formats found for this video.</p>
        )}
      </div>
    </div>
  );
};

export default DownloadOptions;
