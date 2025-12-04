const https = require('https');
const { URL } = require('url');

module.exports = (req, res) => {
  const urlParam = req.query.url;
  
  if (!urlParam) {
    return res.status(400).end('Missing url parameter');
  }

  const fileUrl = Array.isArray(urlParam) ? urlParam[0] : urlParam;
  const decodedUrl = decodeURIComponent(fileUrl);
  
  try {
    new URL(decodedUrl); // Validate URL format
  } catch (e) {
    return res.status(400).end('Invalid URL');
  }
  
  // Set headers first
  res.setHeader('Content-Type', 'model/vnd.usdz+zip');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  
  // Simple HTTPS proxy
  https.get(decodedUrl, (response) => {
    if (response.statusCode !== 200) {
      res.writeHead(response.statusCode);
      res.end('Error: ' + response.statusCode);
      return;
    }
    
    // Pipe response
    response.pipe(res);
    
  }).on('error', (e) => {
    res.writeHead(500);
    res.end('Error');
  });
};
