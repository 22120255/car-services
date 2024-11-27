const redis = require('redis')
require('dotenv').config()

const client = redis.createClient({
    url: process.env.REDIS_URL,
})

client.on('connect', () => {
    console.log('Connected to Redis server')
})

client.on('error', (err) => {
    console.error('Redis error:', err)
})

client.connect().catch(console.error)

module.exports = client
