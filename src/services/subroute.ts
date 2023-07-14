import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { Router, Request, Response, NextFunction } from 'express';
import jwt_decode from "jwt-decode";
import { Subroute } from '../interfaces/subroute';
import Sequelize from "sequelize";
import { v4 as uuidv4 } from 'uuid';



@Service()
export default class AuthService {
    constructor(
        @Inject('subrouteModel') private subrouteModel: any,
        @Inject('userModel') private userModel: any,
        // @Inject('noti_deviceModel') private noti_deviceModel: any,

    ) {
    }

    public async CreateSubRoute(ISubroute: Subroute): Promise<{ returncode: string, message: string }> {

        var adminuserCheck: any;

        await this.userModel.services.findAll(
            { where: { userid: ISubroute.userid, isdeleted: false } }
        ).then((data: any) => {
            if (data.length > 0) {
                adminuserCheck = data[0]
            }
        })

        if (!adminuserCheck) {
            return { returncode: "300", message: "User Not Found" }
        }

        if (adminuserCheck.usertype == 3) {
            return { returncode: "300", message: "User has no aurhorization to create new route." }
        }

        try {

            const subroute_id = "subroute_id" + uuidv4();


            const subrouteData = {
                userid: ISubroute.userid,
                route_id: ISubroute.route_id,
                subroute_id: subroute_id,
                subroute_name: ISubroute.subroute_name,
                cartype_id: ISubroute.cartype_id,
                front_seat_price: ISubroute.front_seat_price,
                back_seat_price: ISubroute.back_seat_price,
                remark: ISubroute.remark,
                subroute_isdeleted: ISubroute.subroute_isdeleted
            }

            console.log(subrouteData);


            var subrouteCheck: any;
            await this.subrouteModel.services.findAll({
                where: {
                    subroute_id: subroute_id,
                    subroute_isdeleted: false
                }
            }).then((data: any) => {
                if (data.length > 0) {
                    subrouteCheck = data[0]
                }
            })

            if (subrouteCheck) {
                return { returncode: "300", message: "Subroute Already Exist." };
            }


            var subrouteRecord: any;
            await this.subrouteModel.services.create(subrouteData).then(
                (data: any) => {
                    subrouteRecord = data
                }
            )

            return { returncode: "200", message: "Success" };

        } catch (e) {
            console.log(e);
            return { returncode: "300", message: "Fail" };
        }
    }

    public async GetAllSubRoutes(req: Request): Promise<{ returncode: string, message: string, data: any }> {

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

                try {
                    var result: any;

                    // Mysql function to delete data
                    await this.subrouteModel.services.findAll({ where: { subroute_isdeleted: false } }).then((data: any) => {
                        if (data) {
                            const returncode = "200";
                            const message = "SubRoute List"

                            console.log(data);

                            // return { returncode, message, data };
                            result = { returncode, message, data };
                        } else {
                            const returncode = "300";
                            const message = "SubRoute list not found"
                            var data: any;
                            result = { returncode, message, data };
                            // throw new Error('Error getting the users.');
                        }
                    });
                    return result;
                } catch (e) {
                    throw e;
                }


            }

        } catch (e) {
            throw e;
        }
    }

    public async GetWithRouteID(req: Request): Promise<{ returncode: string, message: string, data: any }> {

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

                try {
                    var result: any;

                    // Mysql function to delete data
                    await this.subrouteModel.services.findAll({ where: { route_id: req.body.route_id, subroute_isdeleted: false } }).then((data: any) => {
                        if (data) {
                            const returncode = "200";
                            const message = "SubRoute List"

                            console.log(data);

                            // return { returncode, message, data };
                            result = { returncode, message, data };
                        } else {
                            const returncode = "300";
                            const message = "SubRoute list not found"
                            var data: any;
                            result = { returncode, message, data };
                            // throw new Error('Error getting the users.');
                        }
                    });
                    return result;
                } catch (e) {
                    throw e;
                }


            }

        } catch (e) {
            throw e;
        }
    }

    public async DeleteSubroute(req: Request): Promise<{ returncode: string, message: string, data: any }> {

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

        const filter = { subroute_id: req.body.subroute_id, subroute_isdeleted: false };
        const update = { subroute_isdeleted: true };
        try {
            var deleteRecord: any;
            await this.subrouteModel.services.findAll({ where: filter }).then((data: any) => {
                if (data.length > 0) {
                    deleteRecord = data[0];
                }
            });

            if (!deleteRecord) {
                const returncode = "300";
                const message = "Subroute you want to delete is not registered"
                var data: any;
                return { returncode, message, data };
            }


            var result: any;
            await this.subrouteModel.services
                .update(update, {
                    where: filter,
                })
                .then((data: any) => {
                    if (data == 1) {
                        result = { returncode: "200", message: 'Subroute Deleted successfully!' };
                    } else {
                        result = { returncode: "300", message: 'Error deleting subroute' };
                    }
                });

            return result;
        } catch (e) {
            throw e;
        }

    }

    public async updateSubroute(req: Request): Promise<{ returncode: string, message: string }> {

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

            const filter = { subroute_id: req.body.subroute_id };
            const update = {
                userid: req.body.userid,
                subroute_name: req.body.subroute_name,
                car_type_id: req.body.cartype_id,
                front_seat_price: req.body.front_seat_price,
                back_seat_price: req.body.back_seat_price,
                remark: req.body.remark,
                subroute_isdeleted: req.body.subroute_isdeleted
            };
            try {
                var result: any;
                // Mysql function to update data
                await this.subrouteModel.services
                    .update(update, {
                        where: filter,
                    })
                    .then((data: any) => {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Suboute updated successfully!' };
                        } else {
                            result = { returncode: "300", message: 'Error updating Subroute' };
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