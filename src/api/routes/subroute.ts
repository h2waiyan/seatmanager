import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import SubrouteService from '../../services/subroute';
import middlewares from '../middlewares';
import ValidationService from '../../services/validation';
import { Subroute } from '../../interfaces/subroute';
import { celebrate, Joi } from 'celebrate';

const route = Router();

var CreateSubrouteSchema = Joi.object().keys({
    userid: Joi.string().required(),
    route_id: Joi.string().required(),
    subroute_name: Joi.string().required(),
    cartype_id: Joi.string().allow(""),
    front_seat_price: Joi.number(),
    back_seat_price: Joi.number(),
    remark: Joi.string().allow(""),
    subroute_isdeleted: Joi.boolean()
});

var DeleteSubrouteSchema = Joi.object().keys({
    userid: Joi.string().required(),
    subroute_id: Joi.string().required(),
});

export default (app: Router) => {
    app.use('/subroute', route);

    //Sign up
    route.post('/create',
        middlewares.validation(CreateSubrouteSchema),
        middlewares.isAuth,
        middlewares.tokenCheck,
        async (req: Request, res: Response, next: NextFunction) => {

            try {
                const subrouteServiceInstance = Container.get(SubrouteService);
                const { returncode, message } = await subrouteServiceInstance.CreateSubRoute(req.body as Subroute);
                return res.status(200).json({ returncode, message });

            } catch (e) {
                return next(e);
            }
        },
    );

    route.post('/getall',
        // middlewares.validation(),
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const subrouteServiceInstance = Container.get(SubrouteService);
                const { returncode, message, data } = await subrouteServiceInstance.GetAllSubRoutes(req);

                return res.json({ returncode, message, data }).status(200);
            } catch (e) {

                return next(e);
            }
        },
    );

    route.post('/getwithrouteid',
        // middlewares.validation(),
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const subrouteServiceInstance = Container.get(SubrouteService);
                const { returncode, message, data } = await subrouteServiceInstance.GetWithRouteID(req);

                return res.json({ returncode, message, data }).status(200);
            } catch (e) {

                return next(e);
            }
        },
    );

    route.post('/delete',
        middlewares.validation(DeleteSubrouteSchema),

        // middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const subrouteServiceInstance = Container.get(SubrouteService);
                const { returncode, message, data } = await subrouteServiceInstance.DeleteSubroute(req);

                return res.json({ returncode, message, data }).status(200);
            } catch (e) {
                return next(e);
            }
        },
    );

    route.post('/update',
        // middlewares.validation(),
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const subrouteServiceInstance = Container.get(SubrouteService);
                const { returncode, message } = await subrouteServiceInstance.updateSubroute(req);

                return res.json({ returncode, message }).status(200);
            } catch (e) {

                return next(e);
            }
        },
    );


};


