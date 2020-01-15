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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@overnightjs/core");
const jwt_1 = require("@overnightjs/jwt");
const models_1 = require("../models");
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../config/constants");
const result_helper_1 = require("../helpers/result.helper");
const response_helper_1 = require("../helpers/response.helper");
const utils_helper_1 = require("../helpers/utils.helper");
const mailer_helper_1 = require("../helpers/mailer.helper");
const welcome_1 = require("../helpers/templates/welcome");
const jwtMgr = new jwt_1.JwtManager(constants_1.CONSTANTS.SECRET_KEY, constants_1.CONSTANTS.EXPIRATION_DATE);
const User = mongoose_1.default.model('Users', models_1.UserSchema);
const Announce = mongoose_1.default.model('announces', models_1.AnnounceSchema);
let UserController = class UserController {
    testAuth(req, res) {
        User.findByIdAndUpdate({ _id: "5ddd30ac13acd54b9cab4409" }, req.body, {
            new: true,
            runValidators: true
        }, (err, result) => {
            if (err) {
                return response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err), 400);
            }
            return response_helper_1.JSONResponse(res, result_helper_1.Result.ok({ "contacts": result }), 200, { "message": "done" });
        });
    }
    AddUsers(req, res) {
        let newUser = new User(req.body);
        newUser.save((err, user) => {
            if (err) {
                let errorsObject = {};
                for (let key in err.errors) {
                    if (err.errors.hasOwnProperty(key)) {
                        console.log(key + " -> " + err.errors[key]);
                        errorsObject[key] = err.errors[key].message;
                    }
                }
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(errorsObject), 400);
                return;
            }
            const message = {
                from: '"Contact galerieauto" <contact@galerieauto.fr>',
                to: req.body.email,
                subject: 'Galerie Auto - Welcome',
                html: `${welcome_1.welcome}` // Plain text body
            };
            mailer_helper_1.sendMail(message, (data) => {
                response_helper_1.JSONResponse(res, result_helper_1.Result.ok(), 200);
            });
        });
    }
    Login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Missing cred"), 400);
        }
        User.findOne({ "email": email }, (err, result) => {
            if (result) {
                if (utils_helper_1.encryptPass(password) == result.get('password')) {
                    const jwtStr = jwtMgr.jwt({
                        id: result.get('_id'),
                        fullName: req.params.fullname,
                        email: result.get("email"),
                        role: result.get("_role")
                    });
                    response_helper_1.JSONResponse(res, result_helper_1.Result.ok({ token: jwtStr, role: result.get("_role") }), 200);
                }
                else {
                    response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Invalid Password"), 400);
                }
                return;
            }
            console.log(err);
            response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err ? err : "Email doesnt exist"), 400);
        }).select('+password');
    }
    setRole(req, res) {
        const { id, role } = req.body;
        if (!id || !role) {
            return response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Missing cred"), 400);
        }
        let newrole = ['user'];
        if (role == "admin") {
            newrole = ['user', 'agent', 'admin'];
        }
        else if (role == "agent") {
            newrole = ['user', 'agent'];
        }
        else if (role == "user") {
            newrole = ['user'];
        }
        else {
            return response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Invalid cred"), 400);
        }
        User.findOneAndUpdate({ _id: id }, { _role: newrole }, { new: true }, (err, result) => {
            if (result) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.ok(), 200);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err), 400);
        });
    }
    DeleteUser(req, res) {
        const { userid } = req.body;
        if (!userid) {
            response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Missing data"), 400);
            return;
        }
        User.deleteOne({ _id: userid }, (err) => {
            if (!err) {
                Announce.deleteMany({ user_id: userid }, (err) => {
                    if (!err) {
                        response_helper_1.JSONResponse(res, result_helper_1.Result.ok(), 200);
                    }
                    else {
                        response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err), 400);
                    }
                });
            }
            else {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err), 400);
            }
        });
    }
};
__decorate([
    core_1.Get('auth/:id'),
    core_1.Middleware(jwtMgr.middleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "testAuth", null);
__decorate([
    core_1.Post('signup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "AddUsers", null);
__decorate([
    core_1.Post('signin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "Login", null);
__decorate([
    core_1.Post('setrole'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "setRole", null);
__decorate([
    core_1.Delete('delete'),
    core_1.Middleware(jwtMgr.middleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "DeleteUser", null);
UserController = __decorate([
    core_1.Controller('users')
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map