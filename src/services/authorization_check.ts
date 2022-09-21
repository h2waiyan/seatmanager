import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { user } from 'firebase-functions/v1/auth';

@Service()
export default class AuthroizationCheck {
    constructor(
        @Inject('userModel') private userModel: any,
    ) { }

    public async rootAdminCheck(userid: String) {

        var adminCheck: any;
        await this.userModel.services.findAll(
            { where: { userid: userid, isdeleted: false } }
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

    public async adminCheck(userid: String) {

        var adminCheck: any;
        await this.userModel.services.findAll(
            { where: { userid: userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                adminCheck = data[0]
            }
        })

        if (!adminCheck) {
            return "admin-not-found"
        }

        if ( adminCheck.usertype != 1 ||  adminCheck.usertype != 2 ) {
            return "user-has-no-authorization"
        }
    }

    public async userCheck(userid: String) {

        var userCheck: any;
        await this.userModel.services.findAll(
            { where: { userid: userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                userCheck = data[0]
            }
        })

        if (!userCheck) {
            return "user-not-found"
        }

        if ( userCheck.usertype != 1 ||  userCheck.usertype != 2  || userCheck.usertype != 3) {
            return "user-has-no-authorization"
        }

    }

    public async agentCheck(userid: String) {

        var userCheck: any;
        await this.userModel.services.findAll(
            { where: { userid: userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                userCheck = data[0]
            }
        })

        if (!userCheck) {
            return "user-not-found"
        }

        if ( userCheck.usertype != 1 ||  userCheck.usertype != 2  || userCheck.usertype != 3 || userCheck.usertype != 4 ) {
            return "agent-has-no-authorization"
        }

    }

    public async customerCheck(userid: String) {

        var userCheck: any;
        await this.userModel.services.findAll(
            { where: { userid: userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                userCheck = data[0]
            }
        })

        if (!userCheck) {
            return "user-not-found"
        }

        if (userCheck.usertype == 5 ) {
            return "customer-has-no-authorization"
        }

    }
}

