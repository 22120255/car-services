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

async function connectToRedis() {
    try {
        await client.connect();
        console.log('Redis connected successfully');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
}

connectToRedis();

module.exports = client
