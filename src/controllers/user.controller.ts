import { Request, Response, NextFunction } from 'express'
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core'
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import {UserSchema} from "../models";
import mongoose from 'mongoose';
import { Logger } from '@overnightjs/logger';
import {CONSTANTS} from "../config/constants";
import {Result} from "../helpers/result.helper";
import {JSONResponse} from "../helpers/response.helper";
import {encryptPass} from "../helpers/utils.helper";
const jwtMgr = new JwtManager(CONSTANTS.SECRET_KEY, CONSTANTS.EXPIRATION_DATE);


const User = mongoose.model('Users',UserSchema);
@Controller('users')
export class UserController {


    @Get('auth/:id')
    @Middleware(jwtMgr.middleware)
    testAuth(req: ISecureRequest, res: Response): any {

       User.findByIdAndUpdate({_id:"5ddd30ac13acd54b9cab4409"},req.body,{ new: true,runValidators: true },(err,result)=>{
           if(err){
               return JSONResponse(res,Result.fail(err),400);
           }
           return JSONResponse(res,Result.ok({"contacts":result}),200,{"message":"done"});


       })
    }

    @Post('signup')
    AddUsers(req: Request, res: Response):any{
        console.log(req.body);
        let newUser = new User(req.body);
        newUser.save((err,user)=>{
            if(err){
                let errorsObject:any={};
                for (let key in err.errors) {
                    if (err.errors.hasOwnProperty(key)) {
                        console.log(key + " -> " + err.errors[key]);
                        errorsObject[key]=err.errors[key].message;
                    }
                }
                JSONResponse(res,Result.fail(errorsObject),400);
               return;
            }
            JSONResponse(res,Result.ok(),200);
        })
    }

    @Post('signin')
    Login(req: Request, res: Response):any{
       const {email,password} = req.body;
       if(!email || !password){
           return JSONResponse(res,Result.fail("Missing cred"),400);
       }

       User.findOne({"email":email},(err,result)=>{
           if(result){
               if(encryptPass(password) == result.get('password')){
                   const jwtStr = jwtMgr.jwt({
                       fullName: req.params.fullname,
                       email:result.get("email"),
                       role:result.get("_role")
                   });

                   JSONResponse(res,Result.ok({token:jwtStr}),200);
               }else{
                   JSONResponse(res,Result.fail("Invalid Password"),400);

               }
               return;
           }
           console.log(err);

           JSONResponse(res,Result.fail(err?err:"Email doesnt exist"),400);

       })
    }

}
