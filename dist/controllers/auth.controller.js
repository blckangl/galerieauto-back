"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("@overnightjs/jwt");
const core_1 = require("@overnightjs/core");
const constants_1 = require("../config/constants");
const jwtMgr = new jwt_1.JwtManager(constants_1.CONSTANTS.SECRET_KEY, constants_1.CONSTANTS.EXPIRATION_DATE);
let jwtController = class jwtController {
    getJwtFromHandler(req, res) {
        const jwtStr = jwtMgr.jwt({
            fullName: req.params.fullname,
            email: "dhiaa@gmail.com",
            role: 0
        });
        return res.status(http_status_codes_1.OK).json({
            jwt: jwtStr,
        });
    }
    callProtectedRouteFromHandler(req, res) {
        return res.status(http_status_codes_1.OK).json({
            fullname: req.payload.fullName,
        });
    }
};
__decorate([
    core_1.Get(':fullname'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], jwtController.prototype, "getJwtFromHandler", null);
__decorate([
    core_1.Post('protected'),
    core_1.Middleware(jwt_1.JwtManager.middleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], jwtController.prototype, "callProtectedRouteFromHandler", null);
jwtController = __decorate([
    core_1.Controller('api/jwt')
], jwtController);
exports.jwtController = jwtController;
//# sourceMappingURL=auth.controller.js.map