"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const core_1 = require("@overnightjs/core");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
class SampleServer extends core_1.Server {
    constructor() {
        super();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        let AuthController = new auth_controller_1.jwtController();
        let userController = new user_controller_1.UserController();
        super.addControllers([userController, AuthController]);
    }
    start(port) {
        this.app.listen(port, () => {
            console.log('Server listening on port: ' + port);
        });
    }
}
exports.default = SampleServer;
//# sourceMappingURL=sampleserver.js.map