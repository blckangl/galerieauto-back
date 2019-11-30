"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = __importStar(require("body-parser"));
var core_1 = require("@overnightjs/core");
var user_controller_1 = require("../controllers/user.controller");
var auth_controller_1 = require("../controllers/auth.controller");
var SampleServer = /** @class */ (function (_super) {
    __extends(SampleServer, _super);
    function SampleServer() {
        var _this = _super.call(this) || this;
        _this.app.use(bodyParser.json());
        _this.app.use(bodyParser.urlencoded({ extended: true }));
        var AuthController = new auth_controller_1.jwtController();
        var userController = new user_controller_1.UserController();
        _super.prototype.addControllers.call(_this, [userController, AuthController]);
        return _this;
    }
    SampleServer.prototype.start = function (port) {
        this.app.listen(port, function () {
            console.log('Server listening on port: ' + port);
        });
    };
    return SampleServer;
}(core_1.Server));
exports.default = SampleServer;
