"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = __importStar(require("nodemailer"));
const result_helper_1 = require("./result.helper");
exports.sendMail = (message, cb) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true,
        auth: {
            user: "apikey",
            pass: "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"
        }
    });
    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err);
            cb(result_helper_1.Result.fail(err.message));
        }
        else {
            console.log(info);
            cb(result_helper_1.Result.ok());
        }
    });
};
//# sourceMappingURL=mailer.helper.js.map