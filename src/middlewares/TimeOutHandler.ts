if(process.env.NODE_ENV == 'development'){
    var dotenv = require('dotenv');
    dotenv.config()
}
import { Request, Response, NextFunction } from 'express';

const SERVER_TIMEOUT: number = Number(process.env.SERVER_TIMEOUT) || 10000;

export default function(req:Request, res:Response, next:NextFunction){
    res.setTimeout(SERVER_TIMEOUT, function(){
        console.log('Request has timed out.');
        res.sendStatus(408);
    });
    next();
};