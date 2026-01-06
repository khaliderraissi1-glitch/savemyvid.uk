
import React from 'react';
import { VideoMetadata } from '../types';

interface VideoPreviewProps {
  metadata: VideoMetadata;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ metadata }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div className="lg:col-span-2 space-y-6">
        <div className="aspect-video rounded-2xl overflow-hidden bg-slate-800 shadow-xl ring-1 ring-slate-700">
          <img 
            src={metadata.thumbnail} 
            alt={metadata.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">{metadata.title}</h3>
          <div className="flex items-center space-x-4 text-slate-400 text-sm">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {metadata.author}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {metadata.duration}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {metadata.views} views
            </span>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-500">Gemini Intelligence</h4>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-tighter mb-1 font-bold">Smart Summary</p>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                {metadata.summary || "Generating AI summary for this video..."}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-tighter mb-2 font-bold">Video Insight</p>
              <div className="flex flex-wrap gap-2">
                {['Educational', 'High-Quality', 'Viral Potential'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
