import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';

@Service()
export default class ValidationService {

  // users
  public createUserRequest(req: Request) {
    if ((
      req.body.userid &&
      req.body.createuserid &&
      req.body.username &&
      req.body.usertype &&
      req.body.password) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.createuserid && req.body.username && req.body.usertype && req.body.password) == "") {
      return "blankfield";
    }
  }

  public changePwdRequest(req: Request) {
    if ((req.body.userid && req.body.password && req.body.newpassword) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.password && req.body.newpassword) == "") {
      return "blankfield"
    }
  }

  public deleteUserRequest(req: Request) {
    if ((req.body.userid && req.body.deleteuserid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.deleteuserid) == "") {
      return "blankfield"
    }
  }

  public reactivateUserRequest(req: Request) {
    if ((req.body.userid && req.body.deleteduserid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.deleteduserid) == "") {
      return "blankfield"
    }
  }

  public resetUserPwdRequest(req: Request) {
    if ((req.body.userid && req.body.changepwduserid && req.body.newpassword) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.changepwduserid && req.body.newpassword) == "") {
      return "blankfield"
    }
  }

  public editRequest(req: Request) {
    if ((req.body.userid && req.body.username && req.body.edituserid && req.body.usertype) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.username && req.body.edituserid && req.body.usertype) == "") {
      return "blankfield"
    }
  }

  public getUserRequest(req: Request) {
    if ((req.body.userid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid) == "") {
      return "blankfield"
    }
  }

  public getUserDetailsRequest(req: Request) {
    if ((req.body.userid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.detailsuserid) == "") {
      return "blankfield"
    }
  }

  public signinrequest(req: Request) {
    if ((req.body.userid && req.body.uuid && req.body.password) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.uuid && req.body.password) == "") {
      return "blankfield"
    }
  }

  public refreshTokenRequest(req: Request) {
    if ((req.body.userid && req.body.token) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.token) == "") {
      return "blankfield";
    }
  }

  // income/outcome category
  public createCategoryRequest(req: Request) {
    if ((req.body.userid && req.body.category_name && req.body.category_type) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.category_name && req.body.category_type) == "") {
      return "blankfield";
    }
  }

  public CreateDebtRequest(req: Request) {
    if ((req.body.userid && req.body.debt_type && req.body.amount && req.body.due_date) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.debt_type && req.body.amount && req.body.due_date) == "") {
      return "blankfield";
    }
  }

  public EditDebtRequest(req: Request) {
    if ((req.body.userid && req.body.debt_list_id) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.debt_list_id) == "") {
      return "blankfield";
    }
  }

  public CreateBuySellCarsRequest(req: Request) {
    if ((req.body.userid && req.body.buy_sell_type && req.body.amount && req.body.car_no && req.body.car_type) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.buy_sell_type && req.body.amount && req.body.car_no && req.body.car_type) == "") {
      return "blankfield";
    }
  }

  public EditBuySellCarsRequest(req: Request) {
    if ((req.body.userid && req.body.buy_sell_cars_id) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.buy_sell_cars_id) == "") {
      return "blankfield";
    }
  }


  public getCategoryRequest(req: Request) {
    if ((req.body.userid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid) == "") {
      return "blankfield";
    }
  }

  public editCategoryRequest(req: Request) {
    if ((req.body.userid && req.body.category_id) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.category_id) == "") {
      return "blankfield";
    }
  }

  public DeleteNotiDeviceRequest(req: Request) {
    if ((req.body.userid && req.body.uuid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.uuid) == "") {
      return "blankfield";
    }
  }

  public SetupNotiRequest(req: Request) {
    if ((req.body.userid && req.body.noti_type && req.body.noti_data && req.body.category_id && req.body.keyword_id) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.noti_type && req.body.noti_data && req.body.category_id && req.body.keyword_id) == "") {
      return "blankfield";
    }
  }

  public EditNotiRequest(req: Request) {
    if ((req.body.userid && req.body.noti_id && req.body.noti_type && req.body.noti_data && req.body.category_id && req.body.keyword_id) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.noti_id && req.body.noti_type && req.body.noti_data && req.body.category_id && req.body.keyword_id) == "") {
      return "blankfield";
    }
  }

  public NotiListRequest(req: Request) {
    if ((req.body.userid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid) == "") {
      return "blankfield";
    }
  }



  public NotiSeenAndRemoveRequest(req: Request) {
    if ((req.body.userid && req.body.noti_history_id) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.noti_history_id) == "") {
      return "blankfield";
    }
  }

  public GetNotiDetailsRequest(req: Request) {
    if ((req.body.userid && req.body.noti_id) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.noti_id) == "") {
      return "blankfield";
    }
  }

  public CreateKeywordRequest(req: Request) {
    if ((req.body.userid && req.body.keyword_name) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.keyword_name) == "") {
      return "blankfield";
    }
  }

  public GetKeywordRequest(req: Request) {
    if ((req.body.userid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid) == "") {
      return "blankfield";
    }
  }

  public EditKeywordRequest(req: Request) {
    if ((req.body.userid && req.body.keyword_id && req.body.keyword_name && req.body.keyword_isdeleted) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.keyword_id && req.body.keyword_name && req.body.keyword_isdeleted) == "") {
      return "blankfield";
    }
  }

  public CreateBalanceRequest(req: Request) {
    if (req.body.car_inouttype == 2) {
      if ((req.body.userid && req.body.category_id && req.body.balance_type &&
        req.body.balance_name && req.body.car_inouttype && req.body.amount && req.body.date &&
        req.body.go_trip && req.body.comeback_trip && req.body.petrol_price && req.body.khout_kyay
        && req.body.road_services && req.body.misc) == undefined) {
        return "incorrectfield";
      }
      if ((req.body.userid && req.body.category_id && req.body.balance_type && req.body.balance_name &&
        req.body.car_inouttype && req.body.amount && req.body.date &&
        req.body.go_trip && req.body.comeback_trip && req.body.petrol_price && req.body.khout_kyay
        && req.body.road_services && req.body.misc) == "") {
        return "blankfield";
      }
    }
    else {
      if ((req.body.userid && req.body.category_id && req.body.balance_type &&
        req.body.balance_name && req.body.car_inouttype && req.body.amount && req.body.date) == undefined) {
        return "incorrectfield";
      }
      if ((req.body.userid && req.body.category_id && req.body.balance_type && req.body.balance_name &&
        req.body.car_inouttype && req.body.amount && req.body.date) == "") {
        return "blankfield";
      }
    }
  }

  public GetTodayUserBalanceRequest(req: Request) {
    if ((req.body.userid && req.body.date) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.date) == "") {
      return "blankfield";
    }
  }

  public GetDashboardBalanceRequest(req: Request) {
    if ((req.body.userid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid) == "") {
      return "blankfield";
    }
  }


  public BalanceFilterRequest(req: Request) {
    if ((req.body.userid) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid) == undefined) {
      return "blankfield";
    }
  }


  public NextSevenRowsRequest(req: Request) {
    if ((req.body.userid && req.body.dateList) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.dateList) == undefined) {
      return "blankfield";
    }
  }


  public GetBalanceDetails(req: Request) {
    if ((req.body.userid && req.body.balance_id) == undefined) {
      return "incorrectfield";
    }
    if ((req.body.userid && req.body.balance_id) == undefined) {
      return "blankfield";
    }
  }

  public EditBalanceRequest(req: Request) {

    if ((req.body.userid && req.body.category_id && req.body.balance_type &&
      req.body.balance_name && req.body.car_inouttype && req.body.amount && req.body.date
      && req.body.balance_id) == undefined) {
      return "incorrectfield";
    }

    if ((req.body.userid && req.body.category_id && req.body.balance_type && req.body.balance_name &&
      req.body.car_inouttype && req.body.amount && req.body.date &&
      req.body.balance_id) == "") {
      return "blankfield";
    }

  }

  public AddCarBalanceHistoryRequest(req: Request) {
    //   request parameter contain or not
    if ((req.body.userid && req.body.balance_id && req.body.go_trip && req.body.comeback_trip &&
      req.body.petrol_price && req.body.khout_kyay && req.body.road_services &&
      req.body.misc && req.body.total_amount) == undefined) {
      return "incorrectfield";
    }
    //   field blank or not
    if ((req.body.userid && req.body.balance_id && req.body.go_trip && req.body.comeback_trip &&
      req.body.petrol_price && req.body.khout_kyay && req.body.road_services &&
      req.body.misc && req.body.total_amount) == "") {
      return "blankfield";
    }
  }

}
