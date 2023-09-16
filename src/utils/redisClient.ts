/** @module npm */
import redis from 'redis';

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_CLIENT_NAME}:${process.env.REDIS_CLIENT_PASS}
            @${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
});

await redisClient.connect();

export default redisClient;
