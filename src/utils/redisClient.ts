/** @module npm */
import { config } from '@config';
import redis from 'redis';

const options = {
    url: config.redis.getConnectionString(),
};

const redisClient = redis.createClient(options);

await redisClient.connect();

export { redisClient as redis };
