export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  try {
    const fileUrl = Array.isArray(url) ? url[0] : url;
    const decodedUrl = decodeURIComponent(fileUrl);
    
    // Fetch file from Shopify CDN with proper headers
    const response = await fetch(decodedUrl, {
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ error: `Shopify CDN returned ${response.status}` });
    }
    
    // Stream response directly with MIME type override
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Disposition', 'inline; filename="model.usdz"');
    
    // Set content length if available
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    
    // Pipe response body directly
    return response.body.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
