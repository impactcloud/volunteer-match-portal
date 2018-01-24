// Function to force HTTPS
module.exports = function(req, res, next) {

  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.ENVIRONMENT !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
