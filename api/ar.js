const https = require('https');
const http = require('http');

module.exports = async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  try {
    const fileUrl = Array.isArray(url) ? url[0] : url;
    const decodedUrl = decodeURIComponent(fileUrl);
    
    console.log('Fetching:', decodedUrl);
    
    // Download file from URL
    return new Promise((resolve, reject) => {
      const protocol = decodedUrl.startsWith('https') ? https : http;
      
      protocol.get(decodedUrl, (response) => {
        if (response.statusCode !== 200) {
          res.status(response.statusCode).json({ error: `CDN error ${response.statusCode}` });
          return resolve();
        }
        
        // Collect chunks
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          
          // Set headers for iOS AR Quick Look
          res.setHeader('Content-Type', 'model/vnd.usdz+zip');
          res.setHeader('Content-Length', buffer.length.toString());
          res.setHeader('Cache-Control', 'public, max-age=31536000');
          
          res.status(200).end(buffer);
          resolve();
        });
        response.on('error', reject);
      }).on('error', reject);
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
