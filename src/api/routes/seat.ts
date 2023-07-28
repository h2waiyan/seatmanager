import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import SeatService from '../../services/seat';
import SeatHistoryService from '../../services/seat_history';
import middlewares from '../middlewares';
import { SeatManager, GetSeat, GetSeatHistory } from '../../interfaces/seat';
import { Joi } from 'celebrate';

const route = Router();

var SeatCreateSchema = Joi.object().keys({

  userid: Joi.string().required(),

  seat_id: Joi.array().allow(""),
  seat_no_array: Joi.array().required(),
  trip_id: Joi.string().required(),
  sub_route_id: Joi.string().allow(""),
  seat_status: Joi.number().required(),

  car_type: Joi.string().allow(""),

  front_seat_price: Joi.number().required(),
  back_seat_price: Joi.number().required(),

  original_price: Joi.number().required(),
  seat_and_status: Joi.any().required(),

  total_price: Joi.number().allow(""),
  customer_name: Joi.string().allow(""),
  discount: Joi.number().allow(""),
  phone: Joi.string().allow(""),
  gender: Joi.number().allow(""),
  pickup_place: Joi.string().allow(""),
  remark: Joi.string().allow(""),

  seat_isdeleted: Joi.boolean(),

  date_time: Joi.string().required(),

});

var GetSeatsSchema = Joi.object().keys({
  userid: Joi.string().required(),
  trip_id: Joi.string().required(),
});

var GetSeatsHistorySchema = Joi.object().keys({
  userid: Joi.string().required(),
  trip_id: Joi.string().required(),
});

var EditSeatsSchema = Joi.object().keys({
  userid: Joi.string().required(),

  seat_id: Joi.array().required(),
  seat_no_array: Joi.array(),
  trip_id: Joi.string().required(),
  sub_route_id: Joi.string().allow(""),
  seat_status: Joi.number().required(),

  car_type: Joi.string().allow(""),

  front_seat_price: Joi.number().required(),
  back_seat_price: Joi.number().required(),

  original_price: Joi.number().required(),
  seat_and_status: Joi.any().required(),

  total_price: Joi.number().allow(""),
  customer_name: Joi.string().allow(""),
  discount: Joi.number().allow(""),
  phone: Joi.string().allow(""),
  gender: Joi.number().allow(""),
  pickup_place: Joi.string().allow(""),
  remark: Joi.string().allow(""),

  seat_isdeleted: Joi.boolean(),

  date_time: Joi.string().required(),
})


export default (app: Router) => {
  app.use('/seats', route);

  route.post('/create',
    middlewares.validation(SeatCreateSchema),
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const authServiceInstance = Container.get(SeatService);
        const { returncode, message } = await authServiceInstance.CreateSeat(req.body as SeatManager);
        return res.status(200).json({ returncode, message });

      } catch (e) {
        return next(e);
      }
    },
  );

  route.post('/get_history',
    middlewares.validation(GetSeatsHistorySchema),
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const SeatHistoryServiceInstance = Container.get(SeatHistoryService);
        const { returncode, message, data } = await SeatHistoryServiceInstance.GetSeatHistory(req.body as GetSeatHistory);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        return next(e);
      }
    },
  );


  route.post('/get',
    middlewares.validation(GetSeatsSchema),
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const SeatServiceInstance = Container.get(SeatService);
        const { returncode, message, data } = await SeatServiceInstance.GetSeats(req.body as GetSeat);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        return next(e);
      }
    },
  );

  route.post('/edit',
    middlewares.validation(EditSeatsSchema),
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const SeatServiceInstance = Container.get(SeatService);
        const { returncode, message, data } = await SeatServiceInstance.EditSeat(req.body as SeatManager);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        return next(e);
      }
    },
  );
}