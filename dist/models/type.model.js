"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.TypeSchema = new Schema({
    title: {
        type: String,
        required: 'Enter a type title'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=type.model.js.map