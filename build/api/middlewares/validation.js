"use strict";
// import { celebrate, Joi } from 'celebrate';
const Joi = require('joi');
module.exports = (schema, req) => {
    return (req, res, next) => {
        console.log(">>>>>>>>>>>");
        const { error } = schema.validate(req.body);
        if (error != undefined) {
            const returncode = "300";
            const message = error.message;
            res.status(200).json({
                returncode,
                message,
                // errorCause: result.error.name,
            });
        }
        next();
    };
};
// const validation_middleware = () => { 
//   return (req: any, res: any, next: any) => { 
//     const result = Joi.validate(req.body, UserCreateSchema); 
//     if (result.error) {
//         console.log("error");
//         const returncode = "300";
//         const message = "-------> Validation Failed <----------"
//         res.status(200).json({
//             returncode, 
//             message,
//             errorCause: result.error.name,
//         });
//       }
//   } 
// } 
// module.exports = validation_middleware;