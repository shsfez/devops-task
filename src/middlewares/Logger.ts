import { Request, Response, NextFunction } from 'express';

export default function(req:Request, res:Response, next:NextFunction) {
    console.log(`\n*********************************************************************************************`);
    console.log(`***From Host: ${req.ip} at : ${new Date()}`);
    console.log(`***${req.method} "${req.originalUrl}"`);
    next();
}