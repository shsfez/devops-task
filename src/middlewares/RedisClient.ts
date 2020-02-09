import * as redis from 'redis';

// Redis configurations
const REDIS_STRING: string = process.env.REDIS_STRING || "";
var client: redis.RedisClient;
if(process.env.REDIS_MOCK == 'true'){
    // Create mock redis client 
    client = require('redis-mock').createClient(5555, "127.0.0.1");
    console.info(`Redis run on test mode (redis-mock)`)
} else {
    // Create redis client
    client = redis.createClient(REDIS_STRING);
    console.info(`Redis run on normal mode (redis)`)

    // Redis Error handling
    client.on("error", function (err:any) {
        console.error(err);
    });
}


class RedisClient{
    static async set(key:string, value:string):Promise<Boolean>{
        try{
            return new Promise((resolve, reject)=>{
                client.set(key, value, (err)=>{
                    if(err){
                        reject(err)
                    }
                    resolve(true);
                })
            })
        } catch (error){
            console.error(`Error occured during try to set key - ${key}, value - ${value} from redis: ${error}`);
            return false;
        }
    }
    static async get(key:string):Promise<any>{
        try {
            return new Promise((resolve, reject)=>{
                client.get(key, (err:any, reply:any)=>{
                    if(err){
                        reject(err)
                    }
                    console.log(reply);
                    resolve(reply);
                })
            })
        } catch(error){
            console.error(`Error occured during try to get key ${key} from redis: ${error}`);
            return null;
        }
    }
}
export default RedisClient;
