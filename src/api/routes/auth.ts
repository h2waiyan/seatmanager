import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '../../services/auth';
import middlewares from '../middlewares';
import ValidationService from '../../services/validation';
import { IUser, UserLogin } from '../../interfaces/user';
import { celebrate, Joi } from 'celebrate';

const route = Router();

var CreateUserSchema = Joi.object().keys({
  userid: Joi.string().required(),
  usertype: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  gate_id : Joi.number(),
  service_fee_id : Joi.number(),
  remark : Joi.string(),
  createuserid: Joi.string()
});

var SignInSchema = Joi.object().keys({
  userid: Joi.string().required(),
  password: Joi.string().required(),
  uuid : Joi.string(),
  fcmtoken: Joi.string()
});

export default (app: Router) => {
  app.use('/auth', route);

  //Sign up
  route.post('/createuser',
    middlewares.validation(CreateUserSchema),
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const authServiceInstance = Container.get(AuthService);
        const { returncode, message } = await authServiceInstance.CreateUser(req.body as IUser);
        return res.status(200).json({ returncode, message });

      } catch (e) {
        return next(e);
      }
    },
  );

  route.post('/signin',
    middlewares.validation(SignInSchema),
    async (req: Request, res: Response, next: NextFunction) => {

      try {

        const authServiceInstance = Container.get(AuthService);
        const { returncode, message, data, token } = await authServiceInstance.SignIn(req.body as UserLogin);

        return res.json({ returncode, message, data, token }).status(200);
      } catch (e) {

        return next(e);
      }
    },
  );

  route.post('/refreshtoken',
    // middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {

      try {

        const authServiceInstance = Container.get(AuthService);
        const { returncode, message, data, token } = await authServiceInstance.RefreshToken(req);

        return res.json({ returncode, message, data, token }).status(200);
      } catch (e) {
        return next(e);
      }
    },
  );


};


