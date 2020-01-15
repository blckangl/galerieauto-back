"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const models_1 = require("../models");
exports.MarqueSchema = new Schema({
    title: {
        type: String,
        required: 'Enter a marque title'
    },
    type_id: {
        type: String,
        required: 'Provide a valid type id'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});
exports.MarqueSchema.pre('save', function (next) {
    const user = this;
    const types = mongoose_1.default.model('types', models_1.TypeSchema);
    types.findById(this.type_id, (err, value) => {
        if (!value) {
            let error = new Error("Id doesnt exist");
            next(error);
        }
        next();
    });
});
//# sourceMappingURL=marque.model.js.map