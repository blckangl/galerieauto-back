import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
import {encryptPass, validateEmail} from "../helpers/utils.helper";

export const UserSchema = new Schema({
    firstName: {
        type: String,
        required: 'Enter a first name'
    },
    lastName: {
        type: String,
        required: 'Enter a last name'
    },
    email: {
        type: String,
        immutable: true,
        required: true,
        unique: [true,"test"]
    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        select:false
    },
    _role: {
        type: [{
            type: String,
            enum: ['user', 'agent', 'admin']
        }],
        default: ['user']
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    }
});
UserSchema.path('email').validate(function (email: string) {
    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.');
UserSchema.pre('save', function (this: any, next) {
    const user = this;
    this.password = encryptPass(this.password);
    next();
})
UserSchema.plugin(uniqueValidator);
