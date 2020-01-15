"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const constants_1 = require("../config/constants");
const multer_1 = __importDefault(require("multer"));
const validateEmail = (email) => {
    if (!email || email == "" || email == " ") {
        return false;
    }
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
exports.validateEmail = validateEmail;
const encryptPass = (str) => {
    return crypto.createHmac('sha256', constants_1.CONSTANTS.SECRET_KEY)
        .update(str)
        .digest('hex');
};
exports.encryptPass = encryptPass;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
exports.UploadImage = multer_1.default({ storage });
//# sourceMappingURL=utils.helper.js.map