export interface IUser {
    userid: string;
    createuserid : string;
    usertype: number;
    username: string;
    password: string;
    gate_id: string;
    service_fee_id : string;
    user_remark: string;
    isdeleted: string;
    sessionexpired: string;
}

export interface UserLogin {
    userid: string;
    password: string;
    uuid: string;
    fcmtoken: string;
}

export interface ResetPwdInput {
    userid: string;
    password: string;
    newpassword: string;
}