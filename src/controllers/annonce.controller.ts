import {Request, Response, NextFunction} from 'express'
import {Controller, Middleware, Get, Post, Put, Delete} from '@overnightjs/core'
import {JwtManager, ISecureRequest} from '@overnightjs/jwt';
import {MarqueSchema, ModelSchema, TypeSchema, UserSchema, AnnounceSchema} from "../models";
import mongoose from 'mongoose';
import {Logger} from '@overnightjs/logger';
import {CONSTANTS} from "../config/constants";
import {Result} from "../helpers/result.helper";
import {JSONResponse} from "../helpers/response.helper";
import {encryptPass, UploadImage} from "../helpers/utils.helper";
import * as nodemailer from 'nodemailer'
import {sendMail} from '../helpers/mailer.helper'
import fs from "fs";
import path from "path";

const jwtMgr = new JwtManager(CONSTANTS.SECRET_KEY, CONSTANTS.EXPIRATION_DATE);


const Type = mongoose.model('types', TypeSchema);
const Marque = mongoose.model('marques', MarqueSchema);
const Model = mongoose.model('models', ModelSchema);
const Announce = mongoose.model('announces', AnnounceSchema);
const User = mongoose.model('Users', UserSchema);

@Controller('api')
export class AnnouncesController {


    @Post('types/add')
    AddType(req: Request, res: Response): any {
        let type = new Type(req.body);
        type.save((err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Get('types/get')
    GetTypes(req: Request, res: Response): any {
        let types = Type.find((err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Post('marques/add')
    AddMarque(req: Request, res: Response): any {
        let marque = new Marque(req.body);
        marque.save((err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Get('marques/get')
    GetMarques(req: Request, res: Response): any {
        const {typeid} = req.query;
        if (!typeid) {
            JSONResponse(res, Result.fail("Missing data"), 400);
            return;
        }
        let marque = Marque.find({type_id: typeid}, (err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(CONSTANTS.ERRORS.NOTFOUND), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Post('models/add')
    AddModel(req: Request, res: Response): any {
        let model = new Model(req.body);
        model.save((err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Get('models/get')
    GetModels(req: Request, res: Response): any {
        const {marqueid} = req.query;
        if (!marqueid) {
            JSONResponse(res, Result.fail("Missing data"), 400);
            return;
        }
        let model = Model.find({marque_id: marqueid}, (err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }


    @Post('announce/add')
    @Middleware(jwtMgr.middleware)
    AddAnnounce(req: ISecureRequest, res: Response): any {
        console.log(req.payload);
        let body = req.body;
        body.user_id = req.payload.id;
        let announce = new Announce(body);
        announce.save((err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Post('announce/confirme')
    ConfirmeAnnounce(req: Request, res: Response): any {
        const {announceid} = req.body;
        if (!announceid) {
            JSONResponse(res, Result.fail("Missing data"), 400);
            return;
        }

        Announce.findByIdAndUpdate(announceid, {confirmed: 1}, {new: true}, (err, result) => {
            console.log(result);
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            User.findById(result.get('user_id'), (err2, result2) => {
                if (err) {
                    JSONResponse(res, Result.fail(err2.toString()), 400);
                    return;
                } else {
                    if (!result2) {
                        JSONResponse(res, Result.fail("User Doesnt Exist"), 400);
                        return;
                    }

                    const message = {
                        from: 'contact@galerieauto.fr', // Sender address
                        to: result2.get('email'),         // List of recipients
                        subject: 'Galerie Auto - Announce Confirmation', // Subject line
                        html: `
         <div style="display: -webkit-box;
display: -ms-flexbox;
display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column; -webkit-box-align: center; -ms-flex-align: center; align-items: center;padding: 16px">
         <a href="https://galerieauto.fr/"><img width="200" src="https://api.gallerieauto.fr/public/logo.png" /></a>
         <p style="width: 100%">Hi ${result2.get("firstName")},</p>
         <p style="width: 100%">Your post have been confirmed <a href="https://galerieauto.fr/announce/${announceid}">${result.get("title")}</a></p>
</div>
        ` // Plain text body
                    };
                    sendMail(message, (data) => {
                        JSONResponse(res, data, 200);

                    });

                }
            })


        })
    };

    @Get('announce/get')
    GetAnnounce(req: Request, res: Response): any {
        const {typeid, marqueid, modelid, limit, id} = req.query;
        if (id) {
            let announce = Announce.findById(id);
            announce.exec((err, result) => {
                if (err) {
                    console.log(err);
                    JSONResponse(res, Result.fail(CONSTANTS.ERRORS.NOTFOUND), 400);
                    return;
                }
                if (result) {
                    let ann = result;
                    let user = ann.get('user_id');
                    User.findById(user, (err, re) => {
                        if (re) {
                            ann.set('user_name', re.get('firstName'));
                            let announce: any = {};
                            announce.announce = result;
                            announce.user = {firstName: re.get('firstName'), lastName: re.get('lastName')};
                            JSONResponse(res, Result.ok(announce), 200);
                            return;
                        } else {
                            JSONResponse(res, Result.fail("Not found"), 200);
                            return;
                        }
                    })

                } else {
                    JSONResponse(res, Result.fail("Not found"), 200);

                }
            })
        } else if (modelid) {
            let announce = Announce.find({model_id: modelid}, (err, result) => {
                if (err) {
                    JSONResponse(res, Result.fail(CONSTANTS.ERRORS.NOTFOUND), 400);
                    return;
                }
                JSONResponse(res, Result.ok(result), 200);
            })


        } else if (marqueid) {
            let announce = Announce.find({marque_id: marqueid}, (err, result) => {
                if (err) {
                    JSONResponse(res, Result.fail(CONSTANTS.ERRORS.NOTFOUND), 400);
                    return;
                }
                JSONResponse(res, Result.ok(result), 200);
            })
        } else if (typeid) {
            let announce = Announce.find({"type_id": typeid});
            announce.exec((err, result) => {
                if (err) {
                    JSONResponse(res, Result.fail(CONSTANTS.ERRORS.NOTFOUND), 400);
                    return;
                }
                JSONResponse(res, Result.ok(result), 200);
            })
        } else {
            let currlimit = limit ? Number.parseInt(limit) : 0;
            let announce = Announce.find().limit(currlimit);
            announce.exec((err, result) => {
                if (err) {
                    JSONResponse(res, Result.fail(err.toString()), 400);
                    return;
                }
                JSONResponse(res, Result.ok(result), 200);
            })
        }

    }

    @Get('announce/get/byuser')
    GetAnnounceByType(req: Request, res: Response): any {
        const {user} = req.query;
        let announce = Announce.find({user_id: user}, (err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Get('announce/unconfirmed/get')
    GetUnconfirmedAnnounce(req: Request, res: Response): any {
        let announce = Announce.find({"confirmed": 0}, (err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Delete('announce/delete')
    @Middleware(jwtMgr.middleware)
    DeleteUser(req: ISecureRequest, res: Response): any {
        const {id} = req.body;
        if (!id) {

            JSONResponse(res, Result.fail("Missing data"), 400);
            return;

        }
        Announce.deleteOne({_id: id}, (err) => {
            if (!err) {

                JSONResponse(res, Result.ok(), 200);
            } else {
                JSONResponse(res, Result.fail(err), 400);
            }
        })

    }


    @Post('upload')
    @Middleware(UploadImage.single('image'))
    UploadImage(req: Request, res: Response, next: any) {
        if (req.file) {
            JSONResponse(res, Result.ok(req.file), 200);
            next();
            return;
        }
        JSONResponse(res, Result.fail("Coudlnt upload file"), 400);
        next();
    }


    @Get('users/get')
    GetAllUsers(req: Request, res: Response): any {
        User.find((err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }


            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Get('mail/send')
    sendMail(req: Request, res: Response): any {
//         let html = fs.readFileSync(path.resolve(__dirname+'/../helpers/templates', 'welcome.html'), 'utf8')
// console.log(html);
    }

}
