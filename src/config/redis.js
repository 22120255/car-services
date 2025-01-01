const redis = require('redis')

const client = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries >= 5) {
                console.error('Không thể kết nối tới Redis sau 5 lần thử.')
                return new Error('Redis reconnect failed')
            }
            return 1000
        },
        timeout: 10000,
    },
})

client.on('connect', () => {
    console.log('Connected to Redis server')
})

client.on('error', (err) => {
    console.error('Redis error:', err)
})

client.connect().catch(console.error)

module.exports = client
