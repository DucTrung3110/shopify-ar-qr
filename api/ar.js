const https = require('https');

module.exports = async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  try {
    const decodedUrl = Array.isArray(url) ? decodeURIComponent(url[0]) : decodeURIComponent(url);
    
    console.log('Fetching:', decodedUrl);
    
    // Use https.get to fetch the file
    https.get(decodedUrl, (response) => {
      console.log('Response status:', response.statusCode);
      
      if (response.statusCode !== 200) {
        res.status(response.statusCode).end('Error fetching file');
        return;
      }
      
      // Set correct headers BEFORE piping
      res.setHeader('Content-Type', 'model/vnd.usdz+zip');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      // Pipe the response directly
      response.pipe(res);
      
    }).on('error', (err) => {
      console.error('Request error:', err);
      res.status(500).end('Error fetching from CDN');
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).end('Server error');
  }
};
