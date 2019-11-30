import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
import {encryptPass, validateEmail} from "../helpers/utils.helper";

export const TypeSchema = new Schema({
    title: {
        type: String,
        required: 'Enter a type title'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

