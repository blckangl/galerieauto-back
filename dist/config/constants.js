"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class CONSTANTS {
}
exports.CONSTANTS = CONSTANTS;
CONSTANTS.SECRET_KEY = "mYSecretKeyElite";
CONSTANTS.EXPIRATION_DATE = "10h";
CONSTANTS.PORT = 8080;
CONSTANTS.ERRORS = {
    "NOTFOUND": 'No match for this id'
};
//# sourceMappingURL=constants.js.map