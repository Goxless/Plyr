import redis from "redis"
import "dotenv/config"

const redisClient = redis.createClient();

export default redisClient;