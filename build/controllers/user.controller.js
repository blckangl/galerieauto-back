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
var core_1 = require("@overnightjs/core");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.get = function (req, res) {
        console.log(process.env.OVERNIGHT_JWT_EXP);
        console.log(req.params.id);
        return res.status(200).json({ msg: 'get_called' });
    };
    __decorate([
        core_1.Get(':id'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Object)
    ], UserController.prototype, "get", null);
    UserController = __decorate([
        core_1.Controller('api/users')
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
