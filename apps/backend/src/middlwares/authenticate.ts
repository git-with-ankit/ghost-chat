import jwt from "jsonwebtoken"
import { NextFunction,Request,Response } from "express"
import 'dotenv/config'




const authenticate = async(req:Request,res:Response,next : NextFunction)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({error:"No Token Found"})

    }
    try{
        const user = jwt.verify(token,process.env.JWT_SECRET!);
        req.body.user = user;
        next();
    }catch(e){
        console.log(e);
        return res.status(401).json({error:"Unauthorized"})
    }
}

export default authenticate;