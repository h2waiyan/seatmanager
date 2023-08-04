import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { Router, Request, Response, NextFunction } from 'express';
import jwt_decode from "jwt-decode";
import { Gate } from '../interfaces/gate_list';
import Sequelize from "sequelize";
import { v4 as uuidv4 } from 'uuid';



@Service()
export default class AuthService {
    constructor(
        @Inject('gateListModel') private gateListModel: any,
        @Inject('userModel') private userModel: any,
        // @Inject('noti_deviceModel') private noti_deviceModel: any,

    ) {
    }

    public async CreateGate(IGate: Gate): Promise<{ returncode: string, message: string }> {

        var adminuserCheck: any;

        await this.userModel.services.findAll(
            { where: { userid: IGate.userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                adminuserCheck = data[0]
            }
        })

        if (!adminuserCheck) {
            return { returncode: "300", message: "User Not Found" }
        }

        if (adminuserCheck.usertype == 3) {
            return { returncode: "300", message: "User has no aurhorization to create new gate." }
        }

        try {

            const gate_id = "gate_id_" + uuidv4();


            const gateData = {
                gate_id: gate_id,
                userid: IGate.userid,
                gate_name: IGate.gate_name,
                gate_location: IGate.location,
                remark: IGate.remark,
                gate_isdeleted: IGate.gate_isdeleted
            }

            var gateCheck: any;
            await this.gateListModel.services.findAll({
                where: {
                    gate_id: gate_id,
                    gate_isdeleted: false
                }
            }).then((data: any) => {
                if (data.length > 0) {
                    gateCheck = data[0]
                }
            })

            if (gateCheck) {
                return { returncode: "300", message: "Gate Already Exist." };
            }


            var gateRecord: any;
            await this.gateListModel.services.create(gateData).then(
                (data: any) => {
                    gateRecord = data
                }
            )

            return { returncode: "200", message: "Success" };

        } catch (e) {
            console.log(e);
            return { returncode: "300", message: "Fail" };
        }
    }

    public async GetGates(req: Request): Promise<{ returncode: string, message: string, data: any }> {

        const Op = Sequelize.Op;

        try {
            var userRecord: any;

            console.log(req.body.userid);
            // Mysql function to find data
            // before updating the password, we need to check user is registered or not
            await this.userModel.services.findAll(
                { where: { userid: req.body.userid } }
            ).then((data: any) => {
                if (data.length > 0) {
                    userRecord = data[0];
                }
            });

            if (!userRecord) {
                const returncode = "300";
                const message = "Admin Not Found"
                var data: any;
                return { returncode, message, data };
            } else {
                // if (userRecord.usertype == 1 || userRecord.usertype == 2) {
                try {
                    var result: any;

                    await this.gateListModel.services.findAll({ where: { gate_isdeleted: false } }).then((data: any) => {
                        if (data) {
                            const returncode = "200";
                            const message = "Gate List"

                            console.log(data);

                            // return { returncode, message, data };
                            result = { returncode, message, data };
                        } else {
                            const returncode = "300";
                            const message = "Gate list not found"
                            var data: any;
                            result = { returncode, message, data };
                            // throw new Error('Error getting the users.');
                        }
                    });
                    return result;
                } catch (e) {
                    throw e;
                }
                // }
                // else {
                //     const returncode = "300";
                //     const message = "User has no authorization to get all users."
                //     var data: any;
                //     return { returncode, message, data };
                // }

            }

        } catch (e) {
            throw e;
        }
    }

    public async DeleteGate(req: Request): Promise<{ returncode: string, message: string, data: any }> {

        var userRecord: any;
        await this.userModel.services.findAll(
            { where: { userid: req.body.userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                userRecord = data[0];
            }
        });

        if (!userRecord) {
            var data: any;
            return { returncode: "300", message: "Admin Not Registered", data };
        }

        // var checkResult = this.checkUserAuth(userRecord);
        // return checkResult!;
        if (userRecord.usertype == 3) {
            var data: any;
            return { returncode: "300", message: "User has no authorization to delete users.", data };
        }
        /**
         * We use verify from argon2 to prevent 'timing based' attacks
         */

        const filter = { gate_id: req.body.gate_id, gate_isdeleted: false };
        const update = { gate_isdeleted: true };
        try {
            var deletegateRecord: any;
            await this.gateListModel.services.findAll({ where: filter }).then((data: any) => {
                if (data.length > 0) {
                    deletegateRecord = data[0];
                }
            });

            if (!deletegateRecord) {
                const returncode = "300";
                const message = "Gate you want to delete is not registered"
                var data: any;
                return { returncode, message, data };
            }


            var result: any;
            await this.gateListModel.services
                .update(update, {
                    where: filter,
                })
                .then((data: any) => {
                    if (data == 1) {
                        result = { returncode: "200", message: 'Gate Deleted successfully!' };
                    } else {
                        result = { returncode: "300", message: 'Error deleting gate' };
                    }
                });

            return result;
        } catch (e) {
            throw e;
        }

    }

    public async updateGate(req: Request): Promise<{ returncode: string, message: string }> {

        try {
            var userRecord: any;
            await this.userModel.services.findAll(
                { where: { userid: req.body.userid, isdeleted: false } }
            ).then((data: any) => {
                if (data.length > 0) {
                    userRecord = data[0];
                }
            });

            if (!userRecord) {
                return { returncode: "300", message: "User Not Registered" };
            }

            const filter = { gate_id: req.body.gate_id };
            const update = {
                userid: req.body.userid,
                gate_name: req.body.gate_name,
                gate_location: req.body.location,
                remark: req.body.remark,
                gate_isdeleted: req.body.gate_isdeleted
            };
            try {
                var result: any;
                // Mysql function to update data
                await this.gateListModel.services
                    .update(update, {
                        where: filter,
                    })
                    .then((data: any) => {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Gate updated successfully!' };
                        } else {
                            result = { returncode: "300", message: 'Error updating Gate' };
                        }
                    });

                return result;
            } catch (e) {
                throw e;
            }

        } catch (e) {
            throw e;
        }
    }

}