import * as nodemailer from 'nodemailer'
import Email from 'email-templates';
import {Result} from "./result.helper";

export const sendMail = (message:any,cb:(res:Result<any>)=>void) => {
    const transporter = nodemailer.createTransport({

        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: "apikey",
            pass: "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"
        }
    });

    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
            cb(Result.fail(err.message));
        } else {
            console.log(info);
            cb(Result.ok());

        }
    });
}
