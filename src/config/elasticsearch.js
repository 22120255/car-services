require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'https://car-services-search-5279046261.us-east-1.bonsaisearch.net:443',
  auth: {
    username: 'ta538g18ik',
    password: 'h3ad6q4g9o',
  },
  ssl: {
    rejectUnauthorized: false, // Bỏ qua xác minh server
  },
  log: 'trace',
});

// client
//   .ping()
//   .then(() => console.log('Elasticsearch connected successfully!'))
//   .catch((err) => {
//     console.error('Elasticsearch connection failed:', err.message);
//     process.exit(1);
//   });

exports.client = client;
