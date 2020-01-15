"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const express_1 = __importDefault(require("express"));
const core_1 = require("@overnightjs/core");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const mongoose_1 = __importDefault(require("mongoose"));
const annonce_controller_1 = require("../controllers/annonce.controller");
const cors_1 = __importDefault(require("cors"));
class SampleServer extends core_1.Server {
    constructor() {
        super();
        // public mongoUrl: string = 'mongodb://151.80.123.209:27017/gallerieauto';
        this.mongoUrl = 'mongodb://admin:123456Mongo@51.77.214.181/gallerieauto?authSource=admin&w=1\n';
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "galerieauto.fr");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "*");
            next();
        });
        this.app.use(cors_1.default());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use('/public', express_1.default.static('public'));
        this.mongoSetup();
        let AuthController = new auth_controller_1.jwtController();
        let userController = new user_controller_1.UserController();
        let announceController = new annonce_controller_1.AnnouncesController();
        super.addControllers([userController, AuthController, announceController]);
    }
    mongoSetup() {
        console.log("starting setup");
        mongoose_1.default.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("connected to db");
            }
        });
    }
    start(port) {
        this.app.listen(port, async () => {
            console.log('Server listening on port: ' + port);
        });
    }
}
exports.default = SampleServer;
//# sourceMappingURL=sampleserver.js.map