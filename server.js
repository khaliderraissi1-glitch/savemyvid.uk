import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ytdlp from 'yt-dlp-exec';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

const infoLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { error: 'Calm down! You are fetching video info too fast.' }
});

const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Hourly download limit reached.' }
});

// Validation Schema
const urlSchema = z.object({
  url: z.string().url().refine(
    (u) => u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com'),
    { message: 'Only YouTube or supported URLs are allowed' }
  )
});

// API: Get Video Info
app.get('/api/info', infoLimiter, async (req, res) => {
  try {
    const { url } = urlSchema.parse({ url: req.query.url });
    const output = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
    });

    const formats = output.formats
      .filter(f => f.vcodec !== 'none' || f.acodec !== 'none')
      .map(f => ({
        id: f.format_id,
        quality: f.format_note || f.resolution || 'Unknown',
        format: f.ext,
        size: f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : 'Size Unknown',
        type: f.vcodec !== 'none' ? 'video' : 'audio'
      }))
      .filter((v, i, a) => a.findIndex(t => (t.quality === v.quality && t.type === v.type)) === i)
      .slice(0, 10);

    res.json({
      title: output.title,
      author: output.uploader,
      thumbnail: output.thumbnail,
      duration: output.duration_string,
      formats: formats
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to fetch video metadata' });
  }
});

// API: Download/Stream Video
app.get('/api/download', downloadLimiter, (req, res) => {
  try {
    const { url, formatId, title } = req.query;
    urlSchema.parse({ url });

    const safeTitle = (title || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp4"`);
    res.header('Content-Type', 'application/octet-stream');

    const subprocess = ytdlp.exec(url, {
      format: formatId || 'bestvideo+bestaudio/best',
      output: '-',
    });

    subprocess.stdout.pipe(res);
    req.on('close', () => { if (subprocess && !subprocess.killed) subprocess.kill(); });
  } catch (error) {
    res.status(400).send('Invalid request parameters');
  }
});

// Static files for Vercel
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));

export default app; // Essential for Vercel Serverless
