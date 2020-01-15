"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.AnnounceSchema = new Schema({
    title: {
        type: String,
        required: 'Enter a model title'
    },
    user_id: {
        type: String,
        required: 'Provide a valid user id'
    },
    contact_phone: {
        type: Number,
        required: 'Provide a valid phone number'
    },
    description: {
        type: String,
        required: 'Provide a valid description'
    },
    color: {
        type: String,
        required: 'Provide a valid color'
    },
    chv: {
        type: Number,
        required: 'Provide a valid chv'
    },
    carburant: {
        type: String,
        enum: ['ESSENCE', 'DIESEL', 'ELECTRICITY', 'OTHER'],
        default: 'Essence'
    },
    price: {
        type: Number,
        required: 'Enter a valid price'
    },
    circulation_date: {
        type: Date,
    },
    kilo: {
        type: Number
    },
    model_id: {
        type: String,
        required: 'Enter a valid model id'
    },
    marque_id: {
        type: String,
        required: 'Enter a valid marque id'
    },
    img_cover: {
        type: String,
        required: 'Enter a valid image cover'
    },
    img_array: {
        type: Array(),
        default: []
    },
    type_id: {
        type: String,
        required: 'Enter a valid type id'
    },
    confirmed: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=announces.model.js.map