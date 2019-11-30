import { OK } from 'http-status-codes';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import {CONSTANTS} from "../config/constants";
const jwtMgr = new JwtManager(CONSTANTS.SECRET_KEY, CONSTANTS.EXPIRATION_DATE);


@Controller('api/jwt')
export class jwtController {

    @Get(':fullname')
    private getJwtFromHandler(req: Request, res: Response) {
        const jwtStr = jwtMgr.jwt({
            fullName: req.params.fullname,
            email:"dhiaa@gmail.com",
            role:0
        });
        return res.status(OK).json({
            jwt: jwtStr,
        });
    }

    @Post('protected')
    @Middleware(JwtManager.middleware)
    private callProtectedRouteFromHandler(req: ISecureRequest, res: Response) {
        return res.status(OK).json({
            fullname: req.payload.fullName,
        });
    }
}
