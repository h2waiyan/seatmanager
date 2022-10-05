import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import SeatService from '../../services/seat';
import middlewares from '../middlewares';
import { SeatManager, GetSeat } from '../../interfaces/seat';
import { Joi } from 'celebrate';

const route = Router();

var SeatCreateSchema = Joi.object().keys({

  userid: Joi.string().required(),

  seat_id: Joi.array().allow(""),
  seat_no_array: Joi.array().required(),
  trip_id: Joi.string().required(),
  sub_route_id: Joi.string().allow(""),
  seat_status: Joi.number().required(),

  original_price : Joi.number().required(),
  seat_and_status: Joi.any().required(),

  total_price: Joi.number().allow(""),
  customer_name: Joi.string().allow(""),
  discount: Joi.number().allow(""),
  phone: Joi.string().allow(""),
  gender: Joi.number().allow(""),
  pickup_place: Joi.string().allow(""),
  remark: Joi.string().allow(""),

  seat_isdeleted: Joi.boolean(),

});

var GetSeatsSchema = Joi.object().keys({
  userid: Joi.string().required(),
  trip_id: Joi.string().allow(""),
});

var EditSeatsSchema = Joi.object().keys({
  userid: Joi.string().required(),

  seat_id: Joi.array().required(),
  seat_no_array: Joi.array(),
  trip_id: Joi.string().required(),
  sub_route_id: Joi.string().allow(""),
  seat_status: Joi.number().required(),

  original_price : Joi.number().required(),
  seat_and_status: Joi.any().required(),

  total_price: Joi.number().allow(""),
  customer_name: Joi.string().allow(""),
  discount: Joi.number().allow(""),
  phone: Joi.string().allow(""),
  gender: Joi.number().allow(""),
  pickup_place: Joi.string().allow(""),
  remark: Joi.string().allow(""),

  seat_isdeleted: Joi.boolean(),
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
      const { returncode, message, data } = await SeatServiceInstance.editSeat(req.body as SeatManager);
      return res.status(200).json({ returncode, message, data });

    } catch (e) {
      return next(e);
    }
  },
);
}