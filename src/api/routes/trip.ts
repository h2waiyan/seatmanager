import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import TripService from '../../services/trip';
import middlewares from '../middlewares';
import { Joi } from 'celebrate';
import { TripInterface, GetTripInterface } from '../../interfaces/trip';

const route = Router();

var TripCreateScehma = Joi.object().keys({
    userid: Joi.string().required(),
    trip_id: Joi.string().allow(""),

    gate_id: Joi.string().required(),
    date: Joi.array().required(),
    route_id: Joi.array().required(),
    car_type_id: Joi.array().required(),
    seat_and_status: Joi.string().allow(""),

    car_id: Joi.string().allow(""),
    total_price : Joi.number().allow(""),
    remark: Joi.string().allow(""),
    trip_isdeleted: Joi.boolean(),
});

var GetTripSchema = Joi.object().keys({
    userid: Joi.string().required(),
    gate_id: Joi.string().required(),
    date: Joi.string().required(),
    route_id: Joi.string().required(),
})


var DeleteOneTripSchema = Joi.object().keys({
    userid: Joi.string().required(),
    trip_id: Joi.string().required(),

    // gate_id: Joi.string().required(),
    // date: Joi.string().required(),
    // route_id: Joi.string().required(),
    // car_type_id: Joi.string().required(),
    // seat_and_status: Joi.string().allow(""),

    // car_id: Joi.string().allow(""),
    // total_price : Joi.number().allow(""),
    // remark: Joi.string().allow(""),
    // trip_isdeleted: Joi.boolean(),
});



export default (app: Router) => {
    app.use('/trips', route);

    //Sign up
    route.post('/create',
        middlewares.validation(TripCreateScehma),
        middlewares.isAuth,
        middlewares.tokenCheck,
        async (req: Request, res: Response, next: NextFunction) => {

            try {
                const authServiceInstance = Container.get(TripService);
                const { returncode, message } = await authServiceInstance.CreateTrip(req.body as TripInterface);
                return res.status(200).json({ returncode, message });

            } catch (e) {
                return next(e);
            }
        },
    );

    route.post('/get',
        middlewares.validation(GetTripSchema),
        middlewares.isAuth,
        middlewares.tokenCheck,
        async (req: Request, res: Response, next: NextFunction) => {

            try {
                const authServiceInstance = Container.get(TripService);
                const { returncode, message, data } = await authServiceInstance.GetTrips(req.body as GetTripInterface);
                return res.status(200).json({ returncode, message, data });

            } catch (e) {
                return next(e);
            }
        },
    );

    route.post('/single_delete',
    middlewares.validation(DeleteOneTripSchema),
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const authServiceInstance = Container.get(TripService);
            const { returncode, message, data } = await authServiceInstance.DeleteTrip(req.body as TripInterface);
            return res.status(200).json({ returncode, message, data });

        } catch (e) {
            return next(e);
        }
    },
);

}