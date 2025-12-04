export default function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    res.status(400).json({ error: 'URL parameter required' });
    return;
  }

  try {
    const fileUrl = Array.isArray(url) ? url[0] : url;
    const decodedUrl = decodeURIComponent(fileUrl);
    
    // Validate URL is HTTPS
    if (!decodedUrl.startsWith('https://')) {
      res.status(400).json({ error: 'Invalid URL' });
      return;
    }
    
    // Set MIME type headers and redirect
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    // Redirect to actual file
    res.status(301).setHeader('Location', decodedUrl).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
