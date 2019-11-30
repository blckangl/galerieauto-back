import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
import {encryptPass, validateEmail} from "../helpers/utils.helper";
import {TypeSchema, UserSchema} from "../models";

export const MarqueSchema = new Schema({
    title: {
        type: String,
        required: 'Enter a marque title'
    },
    type_id:{
        type:String,
        required:'Provide a valid type id'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

MarqueSchema.pre('save', function (this: any, next) {
    const user = this;
    const types = mongoose.model('types',TypeSchema);
    types.findById(this.type_id,(err,value)=>{
        if(!value){
            let error = new Error("Id doesnt exist");
            next(error);
        }
        next();
    })

})
