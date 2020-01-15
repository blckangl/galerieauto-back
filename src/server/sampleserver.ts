import * as bodyParser from 'body-parser'
import express from 'express';
import {Server} from '@overnightjs/core'
import {UserController} from '../controllers/user.controller'
import {jwtController} from '../controllers/auth.controller'
import {MongoHelper} from "../helpers/mongo.helper";
import mongoose from "mongoose";
import {CONSTANTS} from "../config/constants";
import {AnnouncesController} from "../controllers/annonce.controller";
import cors from 'cors';
export default class SampleServer extends Server {
    // public mongoUrl: string = 'mongodb://151.80.123.209:27017/gallerieauto';
    public mongoUrl: string = 'mongodb://admin:123456Mongo@51.77.214.181/gallerieauto?authSource=admin&w=1\n';


    constructor() {
        super();
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "galerieauto.fr");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "*");

            next();
        });
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.use('/public',express.static('public'));
        this.mongoSetup();
        let AuthController = new jwtController();
        let userController = new UserController();
        let announceController = new AnnouncesController();
        super.addControllers([userController, AuthController,announceController]);
    }
    private mongoSetup(): void{
        console.log("starting setup");
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true,useUnifiedTopology: true},(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("connected to db");
            }
        })
    }

    public start(port: number) {

        this.app.listen(port, async () => {
            console.log('Server listening on port: ' + port);
        });
    }
}
