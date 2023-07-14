import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import RouteService from '../../services/route';
import middlewares from '../middlewares';
import ValidationService from '../../services/validation';
import { Route } from '../../interfaces/route';
import { celebrate, Joi } from 'celebrate';

const route = Router();

var CreateRouteSchema = Joi.object().keys({
    userid: Joi.string().required(),
    gate_id: Joi.string().required(),
    route_name: Joi.string().required(),
    remark: Joi.string().allow(""),
    route_isdeleted: Joi.boolean()
});

var DeleteRouteSchema = Joi.object().keys({
    userid: Joi.string().required(),
    route_id: Joi.string().required(),
});

export default (app: Router) => {
    app.use('/route', route);

    //Sign up
    route.post('/create',
        middlewares.validation(CreateRouteSchema),
        middlewares.isAuth,
        middlewares.tokenCheck,
        async (req: Request, res: Response, next: NextFunction) => {

            try {
                const routeServiceInstance = Container.get(RouteService);
                const { returncode, message } = await routeServiceInstance.CreateRoute(req.body as Route);
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

                const routeServiceInstance = Container.get(RouteService);
                const { returncode, message, data } = await routeServiceInstance.GetAllRoutes(req);

                return res.json({ returncode, message, data }).status(200);
            } catch (e) {

                return next(e);
            }
        },
    );

    route.post('/getwithgate',
        // middlewares.validation(),
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const routeServiceInstance = Container.get(RouteService);
                const { returncode, message, data } = await routeServiceInstance.GetWithGate(req);

                return res.json({ returncode, message, data }).status(200);
            } catch (e) {

                return next(e);
            }
        },
    );

    route.post('/delete',
        middlewares.validation(DeleteRouteSchema),

        // middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const routeServiceInstance = Container.get(RouteService);
                const { returncode, message, data } = await routeServiceInstance.DeleteRoute(req);

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

                const routeServiceInstance = Container.get(RouteService);
                const { returncode, message } = await routeServiceInstance.updateRoute(req);

                return res.json({ returncode, message }).status(200);
            } catch (e) {

                return next(e);
            }
        },
    );


};


