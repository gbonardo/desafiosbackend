import { Router } from "express";
import { addLogger } from "../config/logger.js";

const loggerRouter = Router();

loggerRouter.use(addLogger);

loggerRouter.get('/fatal', (req,res) => {
    req.logger.fatal('Fatal')
    res.send("Fatal: ")
})

loggerRouter.get('/error', (req,res) => {
    req.logger.error('Error')
    res.send("Error: ")
})

loggerRouter.get('/warning', (req,res) => {
    req.logger.warning('Warning')
    res.send("Warning: ")
})

loggerRouter.get('/info', (req,res) => {
    req.logger.info('Info')
    res.send("Info: ")
})

loggerRouter.get('/http', (req,res) => {
    req.logger.http('Http')
    res.send("Http: ")
})

export default loggerRouter