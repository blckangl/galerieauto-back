import {Request, Response, NextFunction} from 'express'
import {Controller, Middleware, Get, Post, Put, Delete} from '@overnightjs/core'
import {JwtManager, ISecureRequest} from '@overnightjs/jwt';
import {AnnounceSchema, UserSchema} from "../models";
import mongoose from 'mongoose';
import {Logger} from '@overnightjs/logger';
import {CONSTANTS} from "../config/constants";
import {Result} from "../helpers/result.helper";
import {JSONResponse} from "../helpers/response.helper";
import {encryptPass} from "../helpers/utils.helper";
import {sendMail} from "../helpers/mailer.helper";

import fs from 'fs'
import path from 'path'
import {welcome} from '../helpers/templates/welcome'

const jwtMgr = new JwtManager(CONSTANTS.SECRET_KEY, CONSTANTS.EXPIRATION_DATE);


const User = mongoose.model('Users', UserSchema);
const Announce = mongoose.model('announces', AnnounceSchema);

@Controller('users')
export class UserController {


    @Get('auth/:id')
    @Middleware(jwtMgr.middleware)
    testAuth(req: ISecureRequest, res: Response): any {

        User.findByIdAndUpdate({_id: "5ddd30ac13acd54b9cab4409"}, req.body, {
            new: true,
            runValidators: true
        }, (err, result) => {
            if (err) {
                return JSONResponse(res, Result.fail(err), 400);
            }
            return JSONResponse(res, Result.ok({"contacts": result}), 200, {"message": "done"});


        })
    }

    @Post('signup')
    AddUsers(req: Request, res: Response): any {
        let newUser = new User(req.body);
        newUser.save((err, user) => {
            if (err) {
                let errorsObject: any = {};
                for (let key in err.errors) {
                    if (err.errors.hasOwnProperty(key)) {
                        console.log(key + " -> " + err.errors[key]);
                        errorsObject[key] = err.errors[key].message;
                    }
                }
                JSONResponse(res, Result.fail(errorsObject), 400);
                return;
            }
            const message = {
                from:'"Contact galerieauto" <contact@galerieauto.fr>',// Sender address
                to: req.body.email,         // List of recipients
                subject: 'Galerie Auto - Welcome', // Subject line
                html: `${welcome}` // Plain text body
            };
            sendMail(message, (data) => {
                JSONResponse(res, Result.ok(), 200);
            });


        })
    }

    @Post('signin')
    Login(req: Request, res: Response): any {
        const {email, password} = req.body;
        if (!email || !password) {
            return JSONResponse(res, Result.fail("Missing cred"), 400);
        }

        User.findOne({"email": email}, (err, result) => {
            if (result) {
                if (encryptPass(password) == result.get('password')) {
                    const jwtStr = jwtMgr.jwt({
                        id: result.get('_id'),
                        fullName: req.params.fullname,
                        email: result.get("email"),
                        role: result.get("_role")
                    });

                    JSONResponse(res, Result.ok({token: jwtStr, role: result.get("_role")}), 200);
                } else {
                    JSONResponse(res, Result.fail("Invalid Password"), 400);

                }
                return;
            }
            console.log(err);

            JSONResponse(res, Result.fail(err ? err : "Email doesnt exist"), 400);

        }).select('+password')
    }

    @Post('setrole')
    setRole(req: Request, res: Response): any {
        const {id, role} = req.body;
        if (!id || !role) {
            return JSONResponse(res, Result.fail("Missing cred"), 400);
        }
        let newrole = ['user'];
        if (role == "admin") {
            newrole = ['user', 'agent', 'admin'];
        } else if (role == "agent") {
            newrole = ['user', 'agent'];

        } else if (role == "user") {
            newrole = ['user'];

        } else {
            return JSONResponse(res, Result.fail("Invalid cred"), 400);

        }
        User.findOneAndUpdate({_id: id}, {_role: newrole}, {new: true}, (err, result) => {
            if (result) {
                JSONResponse(res, Result.ok(), 200);
                return;
            }
            JSONResponse(res, Result.fail(err), 400);
        });
    }

    @Delete('delete')
    @Middleware(jwtMgr.middleware)
    DeleteUser(req: ISecureRequest, res: Response): any {
        const {userid} = req.body;
        if (!userid) {

            JSONResponse(res, Result.fail("Missing data"), 400);
            return;

        }
        User.deleteOne({_id: userid}, (err) => {
            if (!err) {
                Announce.deleteMany({user_id: userid}, (err) => {
                    if (!err) {
                        JSONResponse(res, Result.ok(), 200);
                    } else {
                        JSONResponse(res, Result.fail(err), 400);
                    }
                })
            } else {
                JSONResponse(res, Result.fail(err), 400);
            }
        })

    }
}
