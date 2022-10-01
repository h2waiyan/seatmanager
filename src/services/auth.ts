import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { Router, Request, Response, NextFunction } from 'express';
import jwt_decode from "jwt-decode";
import AuthroizationCheck from './authorization_check';
import { Container } from 'typedi';
import { IUser, UserLogin } from '../interfaces/user';
import { UserBuilder } from 'firebase-functions/v1/auth';


declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    userid: string,
    exp: number,
  }
}

@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: any,
    // @Inject('noti_deviceModel') private noti_deviceModel: any,

  ) {
  }


  public async CreateUser(IUser : IUser): Promise<{ returncode: string, message: string }> {

    var adminuserCheck: any;
    await this.userModel.services.findAll(
      { where: { userid: IUser.userid, isdeleted: false } }
    ).then((data: any) => {
      if (data.length > 0) {
        adminuserCheck = data[0]
      }
    })

    if (!adminuserCheck) {
      return { returncode: "300", message: "User Not Found" }
    }

    if (adminuserCheck.usertype == 3) {
      return { returncode: "300", message: "User has no aurhorization to create new user." }
    }

    try {

      const hashedPassword = await argon2.hash(IUser.password);
      const userData = {
        // userid: IUser.userid,
        userid : IUser.createuserid,
        username: IUser.username,
        password: hashedPassword,
        usertype: IUser.usertype,
        remark: IUser.remark,
        service_fee_id : IUser.service_fee_id,
        gate_id : IUser.gate_id,

      }

      var userCheck: any;
      await this.userModel.services.findAll({
        where: { 
          userid: IUser.createuserid, 
          isdeleted: false }
      }).then((data: any) => {
        if (data.length > 0) {
          userCheck = data[0]
        }
      })

      if (userCheck) {
        return { returncode: "300", message: "User Already Registered" };
      }

      var deleteduserCheck: any;
      await this.userModel.services.findAll({
        where: { 
          userid: IUser.createuserid, 
          isdeleted: true }
      }).then((data: any) => {
        if (data.length > 0) {
          deleteduserCheck = data[0]
        }
      })

      if (deleteduserCheck) {
        return {
          returncode: "500",
          message: "User Already Registered and want to reactivate account again?"
        };
      }

      var userRecord: any;
      await this.userModel.services.create(userData).then(
        (data: any) => {
          userRecord = data
        }
      )

      return { returncode: "200", message: "Success" };

    } catch (e) {
      console.log(e);
      return { returncode: "300", message: "Fail" };
    }
  }

  public async SignIn(UserLogin : UserLogin) {

    var userRecord: any;

    await this.userModel.services.findAll(
      { where: { userid: UserLogin.userid, isdeleted: false } }
    ).then((data: any) => {
      if (data.length > 0) {
        userRecord = data[0]
      }
    })

    if (!userRecord) {
      return { returncode: "300", message: "User Not Registered"};
    }

    const validPassword = await argon2.verify(userRecord.password, UserLogin.password);

    if (validPassword) {

      // update session expired to false
      await this.userModel.services
      .update({ sessionexpired : false }, {
        where: { userid: UserLogin.userid, isdeleted: false } 
      })
      .then((data: any) => {
        if (data == 1) {
          console.log("session updated ----------")
        } else {
          console.log("error in updating session ---->")
        }
      });

      const token = this.generateToken(userRecord);
      const data = {
        "userid": userRecord.userid,
        "usertype": userRecord.usertype,
        "username": userRecord.username,
        "remark": userRecord.remark,
      };

      if ( UserLogin.fcmtoken == undefined || ""){
        return { returncode: "200", message: "Success", data, token };
      }

      try {
        const noti_device_id = "noti_device_id_" + Math.floor(1000000000 + Math.random() * 9000000000) + Date.now();
        const notiDeviceData = {
          noti_device_id,
          ...UserLogin,
        }

        var dataCheck: any;

        // await this.noti_deviceModel.services.findAll(
        //   { where: { userid: UserLogin.userid, uuid: UserLogin.uuid } }
        // ).then((data: any) => {
        //   if (data.length > 0) {
        //     dataCheck = data[0];
        //   }
        // });

        if (!dataCheck) {
          var newRecord: any;
          // await this.noti_deviceModel.services.create(notiDeviceData).then(
          //   (data: any) => {
          //     newRecord = data
          //   }
          // )
          return { returncode: "200", message: "Success", data, token };
        }

        if (dataCheck) {

          try {

            var filter = { userid: UserLogin.userid, uuid: UserLogin.uuid };
            var update = {
              userid: UserLogin.userid,
              uuid: UserLogin.uuid,
              fcmtoken: UserLogin.fcmtoken
            }

            console.log(update);
            

            // await this.noti_deviceModel.services
            //   .update(update, {
            //     where: filter,
            //   }).then((data: any) => {
            //     if (data) {
            //       if (data == 1) {
            //         return { returncode: "200", message: "Success", data, token };
            //       } else {
            //         return { returncode: "300", message: "Fail" };
            //       }
            //     }
            //   });
          } catch (e) {
            return { returncode: "300", message: "error" }
          }

        }
      }
      catch (e) {
        return { returncode: "300", message: "fail" };
      }
      return { returncode: "200", message: "Success", data, token };
    } else {
      return { returncode: "300", message: "Invalid Password" };
    }
  }

  //refresh token -> useid, token
  public async RefreshToken(req: Request) {

    var token = req.body.token;

    try {
      var decodedToken = <jwt.UserIDJwtPayload>jwt_decode(token);
      var useridfromtoken = decodedToken.userid;
      var exp = decodedToken.exp;
    }
    catch (e) {
      return { returncode: "300", message: "Invalid Token" };
    }


    if (req.body.userid != useridfromtoken) {
      return { returncode: "300", message: "Unauthorized User" };
    }

    if (Date.now() >= exp * 1000) {

      var userRecord: any;

      await this.userModel.services.findAll(
        { where: { userid: useridfromtoken, isdeleted: false } }
      ).then((data: any) => {
        if (data.length > 0) {
          userRecord = data[0]
        }
      })

      if (!userRecord) {
        return { returncode: "300", message: "User Not Registered" };
      }
      else {
        const token = this.generateToken(userRecord);
        const data = {};
        return { returncode: "200", message: "Successfully generated token", data, token };
        // return { user, token };
      }
    } else {
      var data: any;
      return { returncode: "200", message: "Token is valid", data, token };
    }


  }

  private generateToken(user: any) {

    return jwt.sign(
      {
        userid: user.userid,
      },
      config.jwtSecret!,
      {
        expiresIn: "1d",
      }
    );
  }
}

