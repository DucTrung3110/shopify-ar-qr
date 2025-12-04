export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  try {
    // Fetch file từ Shopify CDN
    const fileUrl = Array.isArray(url) ? url[0] : url;
    const decodedUrl = decodeURIComponent(fileUrl);
    
    const response = await fetch(decodedUrl);
    const buffer = await response.arrayBuffer();
    
    // Set proper MIME type cho iOS AR Quick Look
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Length', buffer.byteLength);
    
    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
