import * as bodyParser from 'body-parser'
import express from 'express';
import {Server} from '@overnightjs/core'
import {UserController} from '../controllers/user.controller'
import {jwtController} from '../controllers/auth.controller'
import {MongoHelper} from "../helpers/mongo.helper";
import mongoose from "mongoose";
import {CONSTANTS} from "../config/constants";
import {AnnouncesController} from "../controllers/annonce.controller";
export default class SampleServer extends Server {
    public mongoUrl: string = 'mongodb://localhost/gallerieauto';

    constructor() {
        super();
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
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
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true,useUnifiedTopology: true  },(err)=>{
            if(err){
                console.log("couldnt connect");
            }else{
                console.log("connected");
            }
        })
    }

    public start(port: string) {

        this.app.listen(port, async () => {
            console.log('Server listening on port: ' + port);
        });
    }
}
