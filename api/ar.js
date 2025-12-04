module.exports = (req, res) => {
  res.status(200).json({ test: 'API works', method: 'simple test' });
};
