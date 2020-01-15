"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const models_1 = require("../models");
exports.ModelSchema = new Schema({
    title: {
        type: String,
        required: 'Enter a model title'
    },
    marque_id: {
        type: String,
        required: 'Provide a valid marque id'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});
exports.ModelSchema.pre('save', function (next) {
    const marques = mongoose_1.default.model('marques', models_1.MarqueSchema);
    marques.findById(this.marque_id, (err, value) => {
        if (!value) {
            let error = new Error("Id doesnt exist");
            next(error);
        }
        next();
    });
});
//# sourceMappingURL=model.model.js.map