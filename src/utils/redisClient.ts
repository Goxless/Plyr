/** @module npm */
import redis from 'redis';

const options = {
    url: `redis://${process.env.REDIS_CLIENT_NAME}:${process.env.REDIS_CLIENT_PASS}
            @${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
};

const redisClient = redis.createClient(options);

await redisClient.connect();

export { redisClient as redis };
