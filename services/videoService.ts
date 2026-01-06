const API_BASE = 'http://localhost:3001/api';

export interface BackendInfo {
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  views: string;
  description: string;
  formats: any[];
}

/**
 * Fetches video metadata from the UK-based backend service.
 * Implements granular error handling for better UX during rate limits or server issues.
 */
export async function fetchVideoInfo(url: string): Promise<BackendInfo> {
  try {
    const res = await fetch(`${API_BASE}/info?url=${encodeURIComponent(url)}`);

    if (!res.ok) {
      // 1. Handle Rate Limiting (429 Too Many Requests)
      if (res.status === 429) {
        throw new Error('UK Regional Rate Limit: You are fetching video info too quickly. Please wait a few minutes and try again.');
      }

      // 2. Handle Forbidden/Access Denied (403)
      if (res.status === 403) {
        throw new Error('Access Forbidden: This video might be age-restricted, private, or region-locked.');
      }

      // 3. Handle Not Found (404)
      if (res.status === 404) {
        throw new Error('Video Not Found: Please check if the URL is correct and the video is public.');
      }

      // 4. Handle Bad Request or generic errors (Try to parse JSON error message)
      let errorMessage = 'Failed to fetch video information';
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Response body wasn't JSON or couldn't be read
      }

      // 5. Handle Server Errors (5xx)
      if (res.status >= 500) {
        throw new Error('UK Server Error: Our processing nodes are currently at capacity. Please try again in a few moments.');
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    // If it's an Error object we threw above, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    // Handle network level errors (no connection, CORS issues, etc.)
    throw new Error('Connection Error: Unable to reach SaveMyVid UK servers. Please check your internet connection.');
  }
}

/**
 * Generates a direct download URL for the requested format.
 * Proxies via the backend to handle the stream securely according to UK Fair Use.
 */
export function getDownloadUrl(url: string, formatId: string, title: string): string {
  return `${API_BASE}/download?url=${encodeURIComponent(url)}&formatId=${encodeURIComponent(formatId)}&title=${encodeURIComponent(title)}`;
}
