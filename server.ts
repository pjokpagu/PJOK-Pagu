import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const distDir = path.join(__dirname, 'dist');

// Basic security & parsing
app.disable('x-powered-by');

// Health check endpoint for Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Serve static assets from dist with caching
app.use(express.static(distDir, {
  maxAge: '1h',
  index: 'index.html',
}));

// Fallback all other routes to index.html for SPA routing
app.get('*', (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application build not found. Please run npm run build.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`KKG PJOK server running on http://0.0.0.0:${PORT}`);
});
