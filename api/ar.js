module.exports = (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  const https = require('https');
  const decodedUrl = Array.isArray(url) ? decodeURIComponent(url[0]) : decodeURIComponent(url);
  
  https.get(decodedUrl, (response) => {
    // Set headers FIRST before streaming
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Pipe directly
    response.pipe(res);
  }).on('error', () => {
    res.status(500).json({ error: 'Failed to fetch file' });
  });
};
