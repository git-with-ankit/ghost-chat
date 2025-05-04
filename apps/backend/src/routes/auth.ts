import express from "express"
import { Request,Response } from "express";
const router = express.Router();

import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"

import authenticate from "../middlwares/authenticate";

import "dotenv/config"

router.post("/signup", async (req: Request, res: Response) => {
    const { username, name, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            username : req.body.username
        }
    })
    if(user){
        return res.status(400).json({error:"username already taken"})
    }

    const hashedPassword = await bcrypt.hash(password,10);
    try{
        const newUser = await prisma.user.create({
            data:{
                username: username,
                displayName:name,
                password: hashedPassword,
            }
        })

        const token = jwt.sign({
            id: newUser.id
        },process.env.JWT_SECRET!)
        return res.json({token : token})
    }catch(err){
        return res.status(400).json({error:"User cannot be created right now. Please try again later"})
    }

})

router.post("/signin",async(req:Request,res:Response)=>{
    const {username,password} = req.body;
    try{
        const user = await prisma.user.findUnique({
            where:{
                username:username
            }
        })
        if(!user){
            return res.status(400).json({error:"Username not found"})
        }
        const isCorrectPassword = await bcrypt.compare(password,user.password);
        if(!isCorrectPassword){
            return res.status(400).json({error:"Invalid Password"})
        }
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET!)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            maxAge:86400000
        })
        res.json({token : token, user: user});
    }catch(err){
        res.status(400).json({error:"Cannot signin right now. Please try again later"})
    }

})




module.exports = router;