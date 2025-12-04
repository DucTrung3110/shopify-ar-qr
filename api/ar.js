export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    res.status(400).json({ error: 'URL parameter required' });
    return;
  }

  try {
    const fileUrl = Array.isArray(url) ? url[0] : url;
    const decodedUrl = decodeURIComponent(fileUrl);
    
    console.log('Fetching:', decodedUrl);
    
    // Fetch file from Shopify CDN
    const response = await fetch(decodedUrl);
    
    if (!response.ok) {
      console.error('Shopify returned:', response.status);
      res.status(response.status).json({ error: `Shopify CDN error: ${response.status}` });
      return;
    }
    
    // Get file as buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('File size:', buffer.length, 'bytes');
    
    // Set headers - IMPORTANT for iOS AR Quick Look
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', 'inline; filename="model.usdz"');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Send file
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
