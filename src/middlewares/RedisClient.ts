if(process.env.NODE_ENV == 'development'){
    var dotenv = require('dotenv');
    dotenv.config()
}
import * as redis from 'redis';

// Redis configurations
const REDIS_STRING: string = process.env.REDIS_STRING || "";
var client: redis.RedisClient = redis.createClient(REDIS_STRING);

// Redis Error handling
client.on("error", function (err) {
    console.log("Error " + err);
});

export default client;