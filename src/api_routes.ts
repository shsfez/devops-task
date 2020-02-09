import { Request, Response, NextFunction } from 'express';
import RedisClient from './middlewares/RedisClient';
import { getFromJson, updateJson } from './middlewares/JsonDB';
import TimeOutHandler from './middlewares/TimeOutHandler';
import Logger from './middlewares/Logger';
const routes = require('express').Router();

// Use timeout middleware for all the /api requests
routes.use(TimeOutHandler);
routes.use(Logger);

// Simple test that everything is ok
routes.get('/test', (req: Request, res: Response) => {
    if (!res.headersSent) res.json({ "status": "ok" });
})

// Update the simple file timestamp
routes.post('/update_date', async (req: Request, res: Response) => {
    var timestamp = await updateJson();

    if (!res.headersSent) res.json({
        status: "ok",
        message: "Date was updated in the file!",
        timestamp
    });
})

// Get the simple file timestamp
routes.get('/update_date', async (req: Request, res: Response) => {
    var stringDate: string = await getFromJson();

    if (!res.headersSent) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({
            status: "ok",
            message: `The last update date was at ${stringDate}`
        });
    }
})

// Add key:value pair to redis
routes.post('/update_redis', (req: Request, res: Response) => {
    if (!req.query.key || !req.query.value) {
        if (!res.headersSent) return res.sendStatus(400);
    }
    RedisClient
        .set(req.query.key, req.query.value)
        .then((success:Boolean)=>{
            if (success) {
                if (!res.headersSent) return res.sendStatus(200);
            }
            if (!res.headersSent) return res.sendStatus(500);
        })
        .catch((err)=>{
            console.log(err);
            if (!res.headersSent) return res.status(500);
        })
})


// Get value of a key from redis
routes.get('/from_redis', async (req: Request, res: Response) => {
    if (!req.query.key) {
        if (!res.headersSent) return res.sendStatus(400);
    }
    RedisClient
        .get(req.query.key)
        .then((value)=>{
            console.log(`callback from redis: ${value}`)
            if(value){
                if (!res.headersSent) return res.status(200).send(value);
            }
            if (!res.headersSent) return res.sendStatus(404);
        })
        .catch((err)=>{
            console.log(err);
            if (!res.headersSent) return res.status(404);
        })
})

// Error handling
routes.use(function (err:Error, req:Request, res:Response, next:NextFunction) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// All undefined requests with path '/api' are handled here
routes.all('*', (req: Request, res: Response) => {
    if (!res.headersSent) res.sendStatus(403);
})

// export those routes
module.exports = routes;