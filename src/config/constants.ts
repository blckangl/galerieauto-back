import dotenv from "dotenv";
dotenv.config();

export class CONSTANTS{
    static SECRET_KEY:string = process.env.OVERNIGHT_JWT_SECRET;
    static EXPIRATION_DATE:string = process.env.OVERNIGHT_JWT_EXP;
    static PORT:string = process.env.SERVER_PORT;
}
