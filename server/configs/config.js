module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/smacs',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'smacs_secret_key',
  jwtExpiration: '24h'
}; 