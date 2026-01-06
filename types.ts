
export interface VideoMetadata {
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  views: string;
  description: string;
  publishDate: string;
  summary?: string;
}

export interface DownloadFormat {
  id: string;
  quality: string;
  format: 'mp4' | 'webm' | 'mp3';
  size: string;
  type: 'video' | 'audio';
}

export interface DownloadJob {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  status: 'queued' | 'downloading' | 'converting' | 'completed' | 'failed';
  format: string;
  size: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  FETCHING = 'FETCHING',
  READY = 'READY',
  ERROR = 'ERROR'
}

export type View = 'home' | 'terms' | 'privacy' | 'legal' | 'cookies';
