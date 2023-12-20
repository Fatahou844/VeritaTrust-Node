// redis.js
const redis = require('redis');

const redisClient = redis.createClient(6379);

redisClient.on('error', (err) => {
  console.error('Erreur Redis:', err);
});

module.exports = redisClient;
