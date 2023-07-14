import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import GateService from '../../services/gate';
import middlewares from '../middlewares';
import ValidationService from '../../services/validation';
import { Gate } from '../../interfaces/gate_list';
import { celebrate, Joi } from 'celebrate';

const route = Router();

var CreateGateSchema = Joi.object().keys({
    userid: Joi.string().required(),
    gate_name: Joi.string().required(),
    location: Joi.string().required(),
    remark: Joi.string().allow(""),
    gate_isdeleted: Joi.boolean()
});

var DeleteGateSchema = Joi.object().keys({
    userid: Joi.string().required(),
    gate_id: Joi.string().required(),
});

export default (app: Router) => {
    app.use('/gate', route);

    //Sign up
    route.post('/create',
        middlewares.validation(CreateGateSchema),
        middlewares.isAuth,
        middlewares.tokenCheck,
        async (req: Request, res: Response, next: NextFunction) => {

            try {
                const gateServiceInstance = Container.get(GateService);
                const { returncode, message } = await gateServiceInstance.CreateGate(req.body as Gate);
                return res.status(200).json({ returncode, message });

            } catch (e) {
                return next(e);
            }
        },
    );

    route.post('/get',
        // middlewares.validation(),
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const gateServiceInstance = Container.get(GateService);
                const { returncode, message, data } = await gateServiceInstance.GetGates(req);

                return res.json({ returncode, message, data }).status(200);
            } catch (e) {

                return next(e);
            }
        },
    );

    route.post('/delete',
        middlewares.validation(DeleteGateSchema),

        // middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const gateServiceInstance = Container.get(GateService);
                const { returncode, message, data } = await gateServiceInstance.DeleteGate(req);

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

                const gateServiceInstance = Container.get(GateService);
                const { returncode, message } = await gateServiceInstance.updateGate(req);

                return res.json({ returncode, message }).status(200);
            } catch (e) {

                return next(e);
            }
        },
    );


};


