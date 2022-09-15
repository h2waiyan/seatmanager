import jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode";
const userModel = require('../../models/user');

declare module 'jsonwebtoken' {
    export interface UserIDJwtPayload extends jwt.JwtPayload {
        userid: string,
        exp: number,
    }
}

module.exports = async (req: any, res: any, next: any) => {

    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'

    var token = req.headers.authorization.split(' ')[1];

    try {
        var decodedToken = <jwt.UserIDJwtPayload>jwt_decode(token);
        var useridfromtoken = decodedToken.userid;

        var userCheck: any;
        var sessionexpired : any ;

        await userModel.services.findAll(
            { where: { userid: req.body.userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                userCheck = data[0]
                sessionexpired = userCheck.sessionexpired;
                
            }
        })

        if (req.body.userid != useridfromtoken) {
            const returncode = "300";
            const message = "Invalid User ID and Token"
            res.status(200).json({
                returncode, message
            });
        }

        else {
         
            if (sessionexpired == true ) {
               
                const returncode = "302";
                const message = "Session Expired"
                res.status(200).json({
                    returncode, message
                });
            }
            else {
                next();
            }

        }

    }
    catch (e) {
        console.log(e);
        res.status(401).json({
            returncode: "300", message: "Invalid Token"
        })
    }
};