module.exports = (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  const https = require('https');
  const decodedUrl = Array.isArray(url) ? decodeURIComponent(url[0]) : decodeURIComponent(url);
  
  console.log('AR API called with URL:', decodedUrl);
  
  try {
    const options = {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    https.get(decodedUrl, options, (response) => {
      console.log('Got response from Shopify:', response.statusCode);
      
      if (response.statusCode !== 200) {
        console.log('Bad status:', response.statusCode);
        res.status(response.statusCode).json({ error: `CDN returned ${response.statusCode}` });
        return;
      }
      
      // Set headers FIRST
      res.setHeader('Content-Type', 'model/vnd.usdz+zip');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      console.log('Piping response to client...');
      // Pipe directly
      response.pipe(res);
      
    }).on('error', (err) => {
      console.log('HTTPS error:', err.message);
      res.status(500).json({ error: 'Failed to fetch file: ' + err.message });
    });
    
  } catch (error) {
    console.log('Catch block error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
