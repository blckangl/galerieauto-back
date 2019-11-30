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

const jwtMgr = new JwtManager(CONSTANTS.SECRET_KEY, CONSTANTS.EXPIRATION_DATE);


const Type = mongoose.model('types', TypeSchema);
const Marque = mongoose.model('marques', MarqueSchema);
const Model = mongoose.model('models', ModelSchema);
const Announce = mongoose.model('announces', AnnounceSchema);

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
        let marque = Marque.find((err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
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
        let model = Model.find((err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })
    }

    @Post('announce/add')
    AddAnnounce(req: Request, res: Response): any {
        let announce = new Announce(req.body);
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

        Announce.findOneAndUpdate({_id: announceid}, {confirmed: 1}, (err, result) => {
            if (err) {
                JSONResponse(res, Result.fail(err.toString()), 400);
                return;
            }
            JSONResponse(res, Result.ok(result), 200);
        })

    }

    @Get('announce/get')
    GetAnnounce(req: Request, res: Response): any {
        const {typeid,marqueid,modelid} = req.body;
        console.log(typeid);
        console.log(marqueid);
        if(typeid){
            let announce = Announce.find({"type_id":typeid},(err, result) => {
                if (err) {
                    JSONResponse(res, Result.fail(err.toString()), 400);
                    return;
                }
                JSONResponse(res, Result.ok(result), 200);
            })
        } else if(marqueid){
            let announce = Announce.find({marque_id:marqueid},(err, result) => {
                if (err) {
                    JSONResponse(res, Result.fail(err.toString()), 400);
                    return;
                }
                JSONResponse(res, Result.ok(result), 200);
            })
        }else if(modelid){
            let announce = Announce.find({model_id:modelid},(err, result) => {
                if (err) {
                    JSONResponse(res, Result.fail(err.toString()), 400);
                    return;
                }
                JSONResponse(res, Result.ok(result), 200);
            })
        }else{
            let announce = Announce.find((err, result) => {
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
        const {user} = req.body;
        let announce = Announce.find({user_id:user},(err, result) => {
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


}
