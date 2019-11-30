import * as crypto from "crypto";
import {CONSTANTS} from "../config/constants";
import multer from 'multer';

const validateEmail = (email:string) => {
    if(!email || email==""||email==" "){
        return false;
    }
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const encryptPass = (str:string)=>{
   return crypto.createHmac('sha256', CONSTANTS.SECRET_KEY)
       .update(str)
       .digest('hex');
}

export {validateEmail,encryptPass}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname)
    }
});

export const UploadImage = multer({storage});
