import { Service, Inject } from 'typedi';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { Router, Request, Response, NextFunction } from 'express';
import Sequelize from "sequelize";


@Service()
export default class UserService {
  constructor(
    @Inject('userModel') private userModel: any,
  ) { }

  // to update password -> userid, password, newpassword
  public async updatePassword(req: Request): Promise<{ returncode: string, message: string }> {

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

      // if (userRecord.usertype == 3) {
      //   const returncode = "300";
      //   const message = "User has no authorization to reset password."
      //   var data: any;
      //   return { returncode, message, data };
      // }

      /**
       * We use verify from argon2 to prevent 'timing based' attacks
       */

      const validPassword = await argon2.verify(userRecord.password, req.body.password);
      if (validPassword) {
        const salt = randomBytes(32);
        const hashedPassword = await argon2.hash(req.body.newpassword);
        const filter = { userid: req.body.userid };
        const update = { password: hashedPassword };
        try {
          var result: any;
          // Mysql function to update data
          await this.userModel.services
            .update(update, {
              where: filter,
            })
            .then((data: any) => {
              if (data == 1) {
                result = { returncode: "200", message: 'Password updated successfully!' };
              } else {
                result = { returncode: "300", message: 'Error updating password' };
              }
            });

          return result;
        } catch (e) {
          throw e;
        }
      } else {
        return { returncode: "300", message: "Invalid Password" };
      }
    } catch (e) {
      throw e;
    }
  }

  // to delete user -> userid, adminpassword, deleteuserid
  public async deleteUser(req: Request): Promise<{ returncode: string, message: string, data: any }> {

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

    const filter = { userid: req.body.deleteuserid, isdeleted: false };
    const update = { isdeleted: true };
    try {
      var deleteuserRecord: any;
      await this.userModel.services.findAll({ where: filter }).then((data: any) => {
        if (data.length > 0) {
          deleteuserRecord = data[0];
        }
      });

      if (!deleteuserRecord) {
        const returncode = "300";
        const message = "User you want to delete is not registered"
        var data: any;
        return { returncode, message, data };
      }

      if (userRecord.usertype != 1 && deleteuserRecord.usertype == 1) {
        const returncode = "300";
        const message = "Can't delete Root Admin"
        var data: any;
        return { returncode, message, data };
      }

      var result: any;
      await this.userModel.services
        .update(update, {
          where: filter,
        })
        .then((data: any) => {
          if (data == 1) {
            result = { returncode: "200", message: 'User Deleted successfully!' };
          } else {
            result = { returncode: "300", message: 'Error deleting user' };
          }
        });

      return result;
    } catch (e) {
      throw e;
    }

  }

  // to activate deleteuser -> userid, password, deleteduserid,
  public async reactivateDeletedUser(req: Request): Promise<{ returncode: string, message: string, data: any }> {

    try {
      var userRecord: any;
      await this.userModel.services.findAll(
        { where: { userid: req.body.userid } }
      ).then((data: any) => {
        if (data.length > 0) {
          userRecord = data[0];
        }
      });

      if (!userRecord) {
        const returncode = "300";
        const message = "Admin Not Registered"
        var data: any;
        return { returncode: "300", message, data };
      }

      if (userRecord.usertype == 3) {
        const returncode = "300";
        const message = "User has no authorization to activate user."
        var data: any;
        return { returncode, message, data };
      }

      var deleteduserRecord: any;
      // Mysql function to find data
      // before updating the password, we need to check user is registered or not
      await this.userModel.services.findAll({ where: { userid: req.body.deleteduserid, isdeleted: true } }).then((data: any) => {
        if (data.length > 0) {
          deleteduserRecord = data[0];
        }
      });

      if (!deleteduserRecord) {
        const returncode = "300";
        const message = "User Not Found"
        var data: any;
        return { returncode, message, data };
      }

      /**
       * We use verify from argon2 to prevent 'timing based' attacks
       */
      const filter = { userid: req.body.deleteduserid, isdeleted: true };
      const update = { isdeleted: false };
      try {
        var result: any;
        // Mysql function to update data
        await this.userModel.services
          .update(update, {
            where: filter,
          })
          .then((data: any) => {
            if (data == 1) {
              result = { returncode: "200", message: 'Activated user successfully!' };
            } else {
              result = { returncode: "300", message: 'Error activating user' };
            }
          });

        return result;
      } catch (e) {
        throw e;
      }

      // else {
      //   const returncode = "300";
      //   const message = "Invalid Password"
      //   var data: any;
      //   return { returncode, message, data };
      // }


    } catch (e) {
      throw e;
    }
  }

  // to change user password -> userid, changepwduserid, newpassword
  public async resetPassword(req: Request): Promise<{ returncode: string, message: string, data: any }> {

    try {
      var userRecord: any;
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
      }

      if (userRecord.usertype == 3) {
        const returncode = "300";
        const message = "User has no authorization to reset password."
        var data: any;
        return { returncode, message, data };
      }


      var changepwduserRecord: any;
      await this.userModel.services.findAll(
        { where: { userid: req.body.changepwduserid, isdeleted: false } }
      ).then((data: any) => {
        if (data.length > 0) {
          changepwduserRecord = data[0];
        }
      });

      if (!changepwduserRecord) {
        const returncode = "300";
        const message = "User Not Registered"
        var data: any;
        return { returncode, message, data };
      }

      if (userRecord.usertype != 1 && changepwduserRecord.usertype == 1) {
        const returncode = "300";
        const message = "Can't reset Root Admin's Password"
        var data: any;
        return { returncode, message, data };
      }

      /**
       * We use verify from argon2 to prevent 'timing based' attacks
       */
      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(req.body.newpassword);

      const filter = { userid: req.body.changepwduserid };
      const update = { password: hashedPassword, sessionexpired: true };
      try {
        var result: any;
        // Mysql function to update data
        await this.userModel.services
          .update(update, {
            where: filter,
          })
          .then((data: any) => {
            if (data == 1) {
              result = { returncode: "200", message: 'Password reseted successfully!' };
            } else {
              result = { returncode: "300", message: 'Error reseting password' };
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

  // to get users -> userid
  public async getusers(req: Request): Promise<{ returncode: string, message: string, data: any }> {

    const Op = Sequelize.Op;

    try {
      var userRecord: any;
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
        if (userRecord.usertype == 1 || userRecord.usertype == 2) {
          try {
            var result: any;
            const filter =
            {
              [Op.or]: [{ usertype: 2, isdeleted: false }, { usertype: 3, isdeleted: false }],
            }

            await this.userModel.services.findAll({ where: filter }).then((data: any) => {
              if (data) {
                const returncode = "200";
                const message = "User List"

                console.log(data);


                var templist: any[] = [];
                data.map((item: any) => {
                  if (item.userid != req.body.userid) {
                    var tempitem = {
                      userid: item.userid,
                      usertype: item.usertype,
                      username: item.username,
                      gateid: item.gate_id,
                      servicefee: item.service_fee_id,
                      remark: item.remark
                    };

                    templist.push(tempitem);
                  }
                });

                data = templist;

                // return { returncode, message, data };
                result = { returncode, message, data };
              } else {
                const returncode = "300";
                const message = "User list not found"
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
        else {
          const returncode = "300";
          const message = "User has no authorization to get all users."
          var data: any;
          return { returncode, message, data };
        }

      }

    } catch (e) {
      throw e;
    }
  }

  // to get userdetails -> userid
  public async getuserdetails(req: Request): Promise<{ returncode: string, message: string, data: any }> {

    const Op = Sequelize.Op;

    try {
      var adminuserRecord: any;
      await this.userModel.services.findAll(
        { where: { userid: req.body.userid } }
      ).then((data: any) => {
        if (data.length > 0) {
          adminuserRecord = data[0];
        }
      });

      if (!adminuserRecord) {
        const returncode = "300";
        const message = "Admin Not Found"
        var data: any;
        return { returncode, message, data };
      }

      try {
        var userRecord: any;
        var result: any;
        const filter = { userid: req.body.detailsuserid, isdeleted: false }
        await this.userModel.services.findAll(
          { where: filter }
        ).then((data: any) => {
          if (data) {

            const returncode = "200";
            const message = "User Details"

            const mydata = {
              "userid": data[0].userid,
              "usertype": data[0].usertype,
              "username": data[0].username,
              "remark": data[0].remark
            };
            result = { returncode, message, data: mydata };
          } else {
            const returncode = "300";
            const message = "User not found"
            var data: any;
            result = { returncode, message, data };
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

  // to edit user details -> userid, ...
  public async EditUser(req: Request): Promise<{ returncode: string, message: string, data: any }> {

    const Op = Sequelize.Op;

    try {
      var adminuserRecord: any;
      // Mysql function to find data
      // before updating the password, we need to check user is registered or not
      await this.userModel.services.findAll(
        { where: { userid: req.body.userid } }
      ).then((data: any) => {
        if (data.length > 0) {
          adminuserRecord = data[0];
        }
      });

      if (!adminuserRecord) {
        const returncode = "300";
        const message = "Admin Not Registered"
        var data: any;
        return { returncode, message, data };
      }

      if (adminuserRecord.usertype == 3) {
        const returncode = "300";
        const message = "User has no authorization to edit."
        var data: any;
        return { returncode, message, data };
      }

      var userRecord: any;
      await this.userModel.services.findAll(
        { where: { userid: req.body.edituserid } }
      ).then((data: any) => {
        if (data.length > 0) {
          userRecord = data[0];
        }
      });

      if (!userRecord) {
        const returncode = "300";
        const message = "User Not Registered"
        var data: any;
        return { returncode, message, data };
      }

      try {

        if (adminuserRecord.usertype != 1 && req.body.usertype == '1') {
          const returncode = "300";
          const message = "Can't make changes to Root Admin"
          var data: any;
          result = { returncode, message, data };
          return result;
        }

        var result: any;
        const filter = { userid: req.body.edituserid }
        const update = {
          usertype: req.body.usertype,
          username: req.body.username,
          remark: req.body.remark
        };
        // Mysql function to delete dat{a
        await this.userModel.services
          .update(update, {
            where: filter,
            returning: true,
          }).then((data: any) => {
            var newRecord = data[1];
            if (newRecord) {
              const returncode = "200";
              const message = "User Edited"

              const data = {
                "userid": newRecord[0].userid,
                "usertype": newRecord[0].usertype,
                "username": newRecord[0].username,
                "remark": newRecord[0].remark
              };

              result = { returncode, message, data };
            } else {
              const returncode = "300";
              const message = "User not found"
              var data: any;
              result = { returncode, message, data };
              // throw new Error('Error getting the users.');
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
