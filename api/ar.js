module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { url } = req.query;
  
  if (!url) {
    res.status(400).json({ error: 'URL parameter required' });
    return;
  }

  try {
    const fileUrl = Array.isArray(url) ? url[0] : url;
    const decodedUrl = decodeURIComponent(fileUrl);
    
    console.log('[AR API] Fetching:', decodedUrl);
    
    // Fetch file from Shopify CDN
    const response = await fetch(decodedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone)'
      }
    });
    
    if (!response.ok) {
      console.error('[AR API] Shopify error:', response.status);
      res.status(response.status).json({ error: `CDN error ${response.status}` });
      return;
    }
    
    // Get file as buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('[AR API] File size:', buffer.length, 'bytes');
    
    // Set headers for iOS AR Quick Look
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Content-Length', buffer.length.toString());
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Write buffer to response
    res.status(200).write(buffer);
    res.end();
    
  } catch (error) {
    console.error('[AR API] Error:', error);
    res.status(500).json({ error: error.message });
  }
};
