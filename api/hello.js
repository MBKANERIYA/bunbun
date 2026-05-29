module.exports = (req, res) => {
  res.status(200).json({ 
      message: "Hello from Vercel API!", 
      url: req.url,
      originalUrl: req.originalUrl,
      headers: req.headers
  })
}
