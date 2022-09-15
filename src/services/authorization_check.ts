import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';

@Service()
export default class AuthroizationCheck {
    constructor(
        @Inject('userModel') private userModel: any,
    ) { }

    public async rootAdminCheck(req: any) {

        var adminCheck: any;
        await this.userModel.services.findAll(
            { where: { userid: req.body.userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                adminCheck = data[0]
            }
        })

        if (!adminCheck) {
            return "admin-not-found"
        }

        if (adminCheck.usertype != 1) {
            return "user-has-no-authorization"
        }
    }

    public async adminCheck(req: any) {

        var adminCheck: any;
        await this.userModel.services.findAll(
            { where: { userid: req.body.userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                adminCheck = data[0]
            }
        })

        if (!adminCheck) {
            return "admin-not-found"
        }

        if (adminCheck.usertype == 3 ) {
            return "user-has-no-authorization"
        }
    }

    public async userCheck(req: any) {

        var userCheck: any;
        await this.userModel.services.findAll(
            { where: { userid: req.body.userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                userCheck = data[0]
            }
        })

        if (!userCheck) {
            return "user-not-found"
        }

    }
}

