import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { Router, Request, Response, NextFunction } from 'express';
import jwt_decode from "jwt-decode";
import { Route } from '../interfaces/route';
import Sequelize from "sequelize";
import { v4 as uuidv4 } from 'uuid';



@Service()
export default class AuthService {
    constructor(
        @Inject('routeModel') private routeModel: any,
        @Inject('gateListModel') private gateListModel: any,
        @Inject('userModel') private userModel: any,
        // @Inject('noti_deviceModel') private noti_deviceModel: any,

    ) {
    }

    public async CreateRoute(IRoute: Route): Promise<{ returncode: string, message: string }> {

        var adminuserCheck: any;

        await this.userModel.services.findAll(
            { where: { userid: IRoute.userid, isdeleted: false } }
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

            const route_id = "route_id" + uuidv4();


            const routeData = {
                userid: IRoute.userid,
                gate_id: IRoute.gate_id,
                route_id: route_id,
                route_name: IRoute.route_name,
                remark: IRoute.remark,
                route_isdeleted: IRoute.route_isdeleted
            }

            var routeCheck: any;
            await this.routeModel.services.findAll({
                where: {
                    route_id: route_id,
                    route_isdeleted: false
                }
            }).then((data: any) => {
                if (data.length > 0) {
                    routeCheck = data[0]
                }
            })

            if (routeCheck) {
                return { returncode: "300", message: "Gate Already Exist." };
            }


            var gateRecord: any;
            await this.routeModel.services.create(routeData).then(
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

    public async GetAllRoutes(req: Request): Promise<{ returncode: string, message: string, data: any }> {

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

                var gateResult: any;
                var result: any;
                var templist: any[] = [];

                try {
                    await this.gateListModel.services.findAll({ where: { gate_isdeleted: false } }).then((data: any) => {
                        if (data) {
                            gateResult = data;
                        }
                    });


                    await this.routeModel.services.findAll({ where: { route_isdeleted: false } }).then((data: any) => {
                        if (data) {
                            const returncode = "200";
                            const message = "Route List"

                            data.map((item: any) => {
                                gateResult.map((el: any) => {
                                    if (item.gate_id == el.gate_id) {
                                        var tempitem = {
                                            route_id: item.route_id,
                                            route_name: item.route_name,
                                            remark: item.remark,
                                            route_isdeleted: item.route_isdeleted,
                                            userid: item.userid,
                                            gate_id: el.gate_id,
                                            gate_name: el.gate_name
                                        };

                                        templist.push(tempitem);
                                    }
                                })

                            });

                            console.log(templist);

                            // return { returncode, message, data };
                            result = {
                                returncode, message, data: templist
                            };
                        } else {
                            const returncode = "300";
                            const message = "Route list not found"
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

    public async GetWithGate(req: Request): Promise<{ returncode: string, message: string, data: any }> {

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
                    await this.routeModel.services.findAll({ where: { gate_id: req.body.gate_id, route_isdeleted: false } }).then((data: any) => {
                        if (data) {
                            const returncode = "200";
                            const message = "Route List"

                            console.log(data);

                            // return { returncode, message, data };
                            result = { returncode, message, data };
                        } else {
                            const returncode = "300";
                            const message = "Route list not found"
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

    public async DeleteRoute(req: Request): Promise<{ returncode: string, message: string, data: any }> {

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

        const filter = { route_id: req.body.route_id, route_isdeleted: false };
        const update = { route_isdeleted: true };
        try {
            var deleteRecord: any;
            await this.routeModel.services.findAll({ where: filter }).then((data: any) => {
                if (data.length > 0) {
                    deleteRecord = data[0];
                }
            });

            if (!deleteRecord) {
                const returncode = "300";
                const message = "Route you want to delete is not registered"
                var data: any;
                return { returncode, message, data };
            }


            var result: any;
            await this.routeModel.services
                .update(update, {
                    where: filter,
                })
                .then((data: any) => {
                    if (data == 1) {
                        result = { returncode: "200", message: 'Route Deleted successfully!' };
                    } else {
                        result = { returncode: "300", message: 'Error deleting route' };
                    }
                });

            return result;
        } catch (e) {
            throw e;
        }

    }

    public async updateRoute(req: Request): Promise<{ returncode: string, message: string }> {

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

            const filter = { route_id: req.body.route_id };
            const update = {
                userid: req.body.userid,
                route_name: req.body.route_name,
                remark: req.body.remark,
                route_isdeleted: req.body.route_isdeleted
            };
            try {
                var result: any;
                // Mysql function to update data
                await this.routeModel.services
                    .update(update, {
                        where: filter,
                    })
                    .then((data: any) => {
                        if (data == 1) {
                            result = { returncode: "200", message: 'Route updated successfully!' };
                        } else {
                            result = { returncode: "300", message: 'Error updating Route' };
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