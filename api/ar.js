export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  try {
    const fileUrl = Array.isArray(url) ? url[0] : url;
    const decodedUrl = decodeURIComponent(fileUrl);
    
    // Fetch file from Shopify CDN
    const response = await fetch(decodedUrl, {
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ error: `Shopify CDN returned ${response.status}` });
    }
    
    // Convert response to buffer
    const buffer = await response.arrayBuffer();
    const data = Buffer.from(buffer);
    
    // Set headers with proper MIME type for iOS AR Quick Look
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Disposition', 'inline; filename="model.usdz"');
    res.setHeader('Content-Length', data.length);
    
    // Send buffer
    res.status(200).end(data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
