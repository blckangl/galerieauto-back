import dotenv from "dotenv";
dotenv.config();

export class CONSTANTS{
    static SECRET_KEY:string ="mYSecretKeyElite";
    static EXPIRATION_DATE:string = "10h";
    static PORT:number = 8080;
    static ERRORS = {
        "NOTFOUND":'No match for this id'
    }
}
