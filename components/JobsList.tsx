
import React from 'react';
import { DownloadJob } from '../types';

interface JobsListProps {
  jobs: DownloadJob[];
}

const JobsList: React.FC<JobsListProps> = ({ jobs }) => {
  if (jobs.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 w-96 max-w-[calc(100vw-2rem)] z-[60]">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-300">Active Tasks</h3>
          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            {jobs.length}
          </span>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="space-y-2">
              <div className="flex items-center space-x-3">
                <img src={job.thumbnail} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{job.title}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{job.status} • {job.format} • {job.size}</p>
                </div>
              </div>
              <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300" 
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsList;
