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
const jwtMgr = new jwt_1.JwtManager(constants_1.CONSTANTS.SECRET_KEY, constants_1.CONSTANTS.EXPIRATION_DATE);
const Type = mongoose_1.default.model('types', models_1.TypeSchema);
const Marque = mongoose_1.default.model('marques', models_1.MarqueSchema);
const Model = mongoose_1.default.model('models', models_1.ModelSchema);
const Announce = mongoose_1.default.model('announces', models_1.AnnounceSchema);
const User = mongoose_1.default.model('Users', models_1.UserSchema);
let AnnouncesController = class AnnouncesController {
    AddType(req, res) {
        let type = new Type(req.body);
        type.save((err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    GetTypes(req, res) {
        let types = Type.find((err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    AddMarque(req, res) {
        let marque = new Marque(req.body);
        marque.save((err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    GetMarques(req, res) {
        const { typeid } = req.query;
        if (!typeid) {
            response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Missing data"), 400);
            return;
        }
        let marque = Marque.find({ type_id: typeid }, (err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(constants_1.CONSTANTS.ERRORS.NOTFOUND), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    AddModel(req, res) {
        let model = new Model(req.body);
        model.save((err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    GetModels(req, res) {
        const { marqueid } = req.query;
        if (!marqueid) {
            response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Missing data"), 400);
            return;
        }
        let model = Model.find({ marque_id: marqueid }, (err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    AddAnnounce(req, res) {
        console.log(req.payload);
        let body = req.body;
        body.user_id = req.payload.id;
        let announce = new Announce(body);
        announce.save((err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    ConfirmeAnnounce(req, res) {
        const { announceid } = req.body;
        if (!announceid) {
            response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Missing data"), 400);
            return;
        }
        Announce.findByIdAndUpdate(announceid, { confirmed: 1 }, { new: true }, (err, result) => {
            console.log(result);
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                return;
            }
            User.findById(result.get('user_id'), (err2, result2) => {
                if (err) {
                    response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err2.toString()), 400);
                    return;
                }
                else {
                    if (!result2) {
                        response_helper_1.JSONResponse(res, result_helper_1.Result.fail("User Doesnt Exist"), 400);
                        return;
                    }
                    const message = {
                        from: 'contact@galerieauto.fr',
                        to: result2.get('email'),
                        subject: 'Galerie Auto - Announce Confirmation',
                        html: `
         <div style="display: -webkit-box;
display: -ms-flexbox;
display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column; -webkit-box-align: center; -ms-flex-align: center; align-items: center;padding: 16px">
         <a href="https://galerieauto.fr/"><img width="200" src="https://api.gallerieauto.fr/public/logo.png" /></a>
         <p style="width: 100%">Hi ${result2.get("firstName")},</p>
         <p style="width: 100%">Your post have been confirmed <a href="https://galerieauto.fr/announce/${announceid}">${result.get("title")}</a></p>
</div>
        ` // Plain text body
                    };
                    mailer_helper_1.sendMail(message, (data) => {
                        response_helper_1.JSONResponse(res, data, 200);
                    });
                }
            });
        });
    }
    ;
    GetAnnounce(req, res) {
        const { typeid, marqueid, modelid, limit, id } = req.query;
        if (id) {
            let announce = Announce.findById(id);
            announce.exec((err, result) => {
                if (err) {
                    console.log(err);
                    response_helper_1.JSONResponse(res, result_helper_1.Result.fail(constants_1.CONSTANTS.ERRORS.NOTFOUND), 400);
                    return;
                }
                if (result) {
                    let ann = result;
                    let user = ann.get('user_id');
                    User.findById(user, (err, re) => {
                        if (re) {
                            ann.set('user_name', re.get('firstName'));
                            let announce = {};
                            announce.announce = result;
                            announce.user = { firstName: re.get('firstName'), lastName: re.get('lastName') };
                            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(announce), 200);
                            return;
                        }
                        else {
                            response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Not found"), 200);
                            return;
                        }
                    });
                }
                else {
                    response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Not found"), 200);
                }
            });
        }
        else if (modelid) {
            let announce = Announce.find({ model_id: modelid }, (err, result) => {
                if (err) {
                    response_helper_1.JSONResponse(res, result_helper_1.Result.fail(constants_1.CONSTANTS.ERRORS.NOTFOUND), 400);
                    return;
                }
                response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
            });
        }
        else if (marqueid) {
            let announce = Announce.find({ marque_id: marqueid }, (err, result) => {
                if (err) {
                    response_helper_1.JSONResponse(res, result_helper_1.Result.fail(constants_1.CONSTANTS.ERRORS.NOTFOUND), 400);
                    return;
                }
                response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
            });
        }
        else if (typeid) {
            let announce = Announce.find({ "type_id": typeid });
            announce.exec((err, result) => {
                if (err) {
                    response_helper_1.JSONResponse(res, result_helper_1.Result.fail(constants_1.CONSTANTS.ERRORS.NOTFOUND), 400);
                    return;
                }
                response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
            });
        }
        else {
            let currlimit = limit ? Number.parseInt(limit) : 0;
            let announce = Announce.find().limit(currlimit);
            announce.exec((err, result) => {
                if (err) {
                    response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                    return;
                }
                response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
            });
        }
    }
    GetAnnounceByType(req, res) {
        const { user } = req.query;
        let announce = Announce.find({ user_id: user }, (err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    GetUnconfirmedAnnounce(req, res) {
        let announce = Announce.find({ "confirmed": 0 }, (err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    DeleteUser(req, res) {
        const { id } = req.body;
        if (!id) {
            response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Missing data"), 400);
            return;
        }
        Announce.deleteOne({ _id: id }, (err) => {
            if (!err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.ok(), 200);
            }
            else {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err), 400);
            }
        });
    }
    UploadImage(req, res, next) {
        if (req.file) {
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(req.file), 200);
            next();
            return;
        }
        response_helper_1.JSONResponse(res, result_helper_1.Result.fail("Coudlnt upload file"), 400);
        next();
    }
    GetAllUsers(req, res) {
        User.find((err, result) => {
            if (err) {
                response_helper_1.JSONResponse(res, result_helper_1.Result.fail(err.toString()), 400);
                return;
            }
            response_helper_1.JSONResponse(res, result_helper_1.Result.ok(result), 200);
        });
    }
    sendMail(req, res) {
        //         let html = fs.readFileSync(path.resolve(__dirname+'/../helpers/templates', 'welcome.html'), 'utf8')
        // console.log(html);
    }
};
__decorate([
    core_1.Post('types/add'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "AddType", null);
__decorate([
    core_1.Get('types/get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "GetTypes", null);
__decorate([
    core_1.Post('marques/add'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "AddMarque", null);
__decorate([
    core_1.Get('marques/get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "GetMarques", null);
__decorate([
    core_1.Post('models/add'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "AddModel", null);
__decorate([
    core_1.Get('models/get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "GetModels", null);
__decorate([
    core_1.Post('announce/add'),
    core_1.Middleware(jwtMgr.middleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "AddAnnounce", null);
__decorate([
    core_1.Post('announce/confirme'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "ConfirmeAnnounce", null);
__decorate([
    core_1.Get('announce/get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "GetAnnounce", null);
__decorate([
    core_1.Get('announce/get/byuser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "GetAnnounceByType", null);
__decorate([
    core_1.Get('announce/unconfirmed/get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "GetUnconfirmedAnnounce", null);
__decorate([
    core_1.Delete('announce/delete'),
    core_1.Middleware(jwtMgr.middleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "DeleteUser", null);
__decorate([
    core_1.Post('upload'),
    core_1.Middleware(utils_helper_1.UploadImage.single('image')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AnnouncesController.prototype, "UploadImage", null);
__decorate([
    core_1.Get('users/get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "GetAllUsers", null);
__decorate([
    core_1.Get('mail/send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AnnouncesController.prototype, "sendMail", null);
AnnouncesController = __decorate([
    core_1.Controller('api')
], AnnouncesController);
exports.AnnouncesController = AnnouncesController;
//# sourceMappingURL=annonce.controller.js.map