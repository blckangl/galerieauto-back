"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const Schema = mongoose_1.default.Schema;
const utils_helper_1 = require("../helpers/utils.helper");
exports.UserSchema = new Schema({
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
        unique: [true, "test"]
    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        select: false
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
exports.UserSchema.path('email').validate(function (email) {
    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.');
exports.UserSchema.pre('save', function (next) {
    const user = this;
    this.password = utils_helper_1.encryptPass(this.password);
    next();
});
exports.UserSchema.plugin(mongoose_unique_validator_1.default);
//# sourceMappingURL=user.model.js.map