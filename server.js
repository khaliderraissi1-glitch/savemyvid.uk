
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const ytdlp = require('yt-dlp-exec');
const path = require('path');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(express.json());

// Rate Limiting Configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  handler: (req, res, next, options) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`);
    res.status(options.statusCode).send(options.message);
  }
});

const infoLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 info fetches per 10 minutes
  message: { error: 'Calm down! You are fetching video info too fast. Please wait 10 minutes.' },
  handler: (req, res, next, options) => {
    console.warn(`Info rate limit hit by ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  }
});

const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 downloads per hour per IP
  message: { error: 'Hourly download limit reached. Please wait an hour to save more videos.' },
  handler: (req, res, next, options) => {
    console.warn(`Download rate limit hit by ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  }
});

// Validation Schema
const urlSchema = z.object({
  url: z.string().url().refine(
    (u) => u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com'),
    { message: 'Only YouTube or supported URLs are allowed' }
  )
});

// API: Get Video Info (with Info Limiter)
app.get('/api/info', infoLimiter, async (req, res) => {
  try {
    const { url } = urlSchema.parse({ url: req.query.url });
    
    console.info(`Fetching info for URL: ${url} from IP: ${req.ip}`);

    const output = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      preferFreeFormats: true,
    });

    // Extract useful formats
    const formats = output.formats
      .filter(f => f.vcodec !== 'none' || f.acodec !== 'none')
      .map(f => ({
        id: f.format_id,
        quality: f.format_note || f.resolution || (f.acodec !== 'none' ? 'Audio Only' : 'Unknown'),
        format: f.ext,
        size: f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : 'Size Unknown',
        type: f.vcodec !== 'none' ? 'video' : 'audio'
      }))
      .filter((v, i, a) => a.findIndex(t => (t.quality === v.quality && t.type === v.type)) === i) // Unique qualities
      .slice(0, 10);

    res.json({
      title: output.title,
      author: output.uploader,
      thumbnail: output.thumbnail,
      duration: output.duration_string,
      views: output.view_count ? output.view_count.toLocaleString() : '0',
      description: output.description,
      formats: formats
    });
  } catch (error) {
    console.error(`Info fetch error for ${req.ip}:`, error);
    res.status(400).json({ error: error.message || 'Failed to fetch video metadata' });
  }
});

// API: Download/Stream Video (with Download Limiter)
app.get('/api/download', downloadLimiter, (req, res) => {
  try {
    const { url, formatId, title } = req.query;
    urlSchema.parse({ url });

    console.info(`Starting download stream for: ${title} requested by IP: ${req.ip}`);

    const safeTitle = (title || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeTitle}.mp4`;
    
    res.header('Content-Disposition', `attachment; filename="${filename}"`);
    res.header('Content-Type', 'application/octet-stream');

    const subprocess = ytdlp.exec(url, {
      format: formatId || 'bestvideo+bestaudio/best',
      output: '-',
    });

    subprocess.stdout.pipe(res);

    subprocess.on('error', (err) => {
      console.error(`Download stream error for ${req.ip}:`, err);
      if (!res.headersSent) res.status(500).send('Download failed');
    });

    // Cleanup if client disconnects
    req.on('close', () => {
      console.info(`Client ${req.ip} disconnected. Terminating download process.`);
      if (subprocess && !subprocess.killed) {
        subprocess.kill();
      }
    });

  } catch (error) {
    console.error(`Download request validation failed for ${req.ip}:`, error);
    res.status(400).send('Invalid request parameters');
  }
});

// Static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
}

app.listen(PORT, () => {
  console.log(`SaveMyVid.uk API running on http://localhost:${PORT}`);
  console.info(`Rate limiting active: 20 info/10m, 10 downloads/hr per IP.`);
});
