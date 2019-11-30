import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
import {encryptPass, validateEmail} from "../helpers/utils.helper";
import {MarqueSchema} from "../models";

export const ModelSchema = new Schema({
    title: {
        type: String,
        required: 'Enter a model title'
    },
    marque_id:{
        type:String,
        required:'Provide a valid marque id'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

ModelSchema.pre('save', function (this: any, next) {
    const marques = mongoose.model('marques',MarqueSchema);
    marques.findById(this.marque_id,(err,value)=>{
        if(!value){
            let error = new Error("Id doesnt exist");
            next(error);
        }
        next();
    })

})
