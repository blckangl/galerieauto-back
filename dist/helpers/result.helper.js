"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(isSuccess, error, value) {
        if (isSuccess && error) {
            throw new Error(`InvalidOperation: A result cannot be 
        successful and contain an error`);
        }
        if (!isSuccess && !error) {
            throw new Error(`InvalidOperation: A failing result 
        needs to contain an error message`);
        }
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;
        Object.freeze(this);
    }
    getValue() {
        if (!this.isSuccess) {
            throw new Error(`Cant retrieve the value from a failed result.`);
        }
        return this._value;
    }
    static ok(value) {
        return new Result(true, null, value);
    }
    static fail(error) {
        return new Result(false, error);
    }
    static combine(results) {
        for (let result of results) {
            if (result.isFailure)
                return result;
        }
        let body = {};
        let key;
        results.forEach((x) => {
            let jsonobj = x.getValue();
            for (key in jsonobj) {
                if (jsonobj.hasOwnProperty(key)) {
                    body[key] = jsonobj[key];
                }
            }
        });
        return Result.ok(body);
    }
}
exports.Result = Result;
//# sourceMappingURL=result.helper.js.map