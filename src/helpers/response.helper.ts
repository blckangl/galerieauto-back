import {Response} from "express";
import {Result} from "./result.helper";

const JSONResponse = (res: Response, result: Result<any>, status: number, body?: any) => {
    let returnedResult = result;
    if (body) {
        returnedResult = Result.combine([result, Result.ok(body)])
    }
    if (returnedResult.isSuccess) {
        return res.status(status).json({
            "success": returnedResult.isSuccess,
            "body": returnedResult.getValue()
        });
    } else {
        return res.status(status).json({
            "fail": returnedResult.isFailure,
            "message": returnedResult.error
        });
    }

}
export {JSONResponse};
