"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_helper_1 = require("./result.helper");
const JSONResponse = (res, result, status, body) => {
    let returnedResult = result;
    if (body) {
        returnedResult = result_helper_1.Result.combine([result, result_helper_1.Result.ok(body)]);
    }
    if (returnedResult.isSuccess) {
        return res.status(status).json({
            "success": returnedResult.isSuccess,
            "body": returnedResult.getValue()
        });
    }
    else {
        return res.status(status).json({
            "fail": returnedResult.isFailure,
            "message": returnedResult.error
        });
    }
};
exports.JSONResponse = JSONResponse;
//# sourceMappingURL=response.helper.js.map