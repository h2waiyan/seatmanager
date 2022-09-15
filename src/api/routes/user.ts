import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import UserService from '../../services/user';
import ValidationService from '../../services/validation';

const route = Router();

export default (app: Router) => {
  
  app.use('/user', route);

  route.get('/test',
    (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({ returncode: 200, message: "OKKKKK" });
    }
  ),

    //Reset Password
    route.post('/updatepassword',
      middlewares.isAuth,
      middlewares.tokenCheck,
      async (req: Request, res: Response, next: NextFunction) => {

        try {

          const ValidationServiceInstance = Container.get(ValidationService);

          if (ValidationServiceInstance.changePwdRequest(req) == 'incorrectfield') {
            return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
          }
          if (ValidationServiceInstance.changePwdRequest(req) == 'blankfield') {
            return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
          }

          const authServiceInstance = Container.get(UserService);
          const { returncode, message } = await authServiceInstance.updatePassword(req);
          return res.status(200).json({ returncode, message });

        } catch (e) {
          const returncode = "300";
          const message = "fail"
          return next({ returncode, message, e });
        }
      },
    );

  route.post('/delete',
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {

        const ValidationServiceInstance = Container.get(ValidationService);

        if (ValidationServiceInstance.deleteUserRequest(req) == 'incorrectfield') {
          return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
        }
        if (ValidationServiceInstance.deleteUserRequest(req) == 'blankfield') {
          return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
        }

        const authServiceInstance = Container.get(UserService);
        const { returncode, message, data } = await authServiceInstance.deleteUser(req);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        const returncode = "300";
        const message = "fail"
        return next({ returncode, message, e });
      }
    },
  );

  route.post('/reactivate',
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {

        const ValidationServiceInstance = Container.get(ValidationService);

        if (ValidationServiceInstance.reactivateUserRequest(req) == 'incorrectfield') {
          return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
        }
        if (ValidationServiceInstance.reactivateUserRequest(req) == 'blankfield') {
          return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
        }

        const authServiceInstance = Container.get(UserService);
        const { returncode, message, data } = await authServiceInstance.reactivateDeletedUser(req);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        const returncode = "300";
        const message = "fail"
        return next({ returncode, message, e });
      }
    },
  );

  route.post('/resetpassword',
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const ValidationServiceInstance = Container.get(ValidationService);

        if (ValidationServiceInstance.resetUserPwdRequest(req) == 'incorrectfield') {
          return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
        }
        if (ValidationServiceInstance.resetUserPwdRequest(req) == 'blankfield') {
          return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
        }
        const authServiceInstance = Container.get(UserService);
        const { returncode, message, data } = await authServiceInstance.resetPassword(req);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        const returncode = "300";
        const message = "fail"
        return next({ returncode, message, e });
      }
    },
  );

  route.post('/getusers',
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const ValidationServiceInstance = Container.get(ValidationService);

        if (ValidationServiceInstance.getUserRequest(req) == 'incorrectfield') {
          return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
        }
        if (ValidationServiceInstance.getUserRequest(req) == 'blankfield') {
          return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
        }

        const authServiceInstance = Container.get(UserService);
        const { returncode, message, data } = await authServiceInstance.getusers(req);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        const returncode = "300";
        const message = "fail"
        return next({ returncode, message, e });
      }
    },
  );

  route.post('/getuserdetails',
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const ValidationServiceInstance = Container.get(ValidationService);

        if (ValidationServiceInstance.getUserDetailsRequest(req) == 'incorrectfield') {
          return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
        }
        if (ValidationServiceInstance.getUserDetailsRequest(req) == 'blankfield') {
          return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
        }

        const authServiceInstance = Container.get(UserService);
        const { returncode, message, data } = await authServiceInstance.getuserdetails(req);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        const returncode = "300";
        const message = "fail"
        return next({ returncode, message, e });
      }
    },
  );

  route.post('/edituser',
    middlewares.isAuth,
    middlewares.tokenCheck,
    async (req: Request, res: Response, next: NextFunction) => {

      try {

        const ValidationServiceInstance = Container.get(ValidationService);

        if (ValidationServiceInstance.editRequest(req) == 'incorrectfield') {
          return res.status(200).json({ returncode: "300", message: "Incorrect fields" });
        }
        if (ValidationServiceInstance.editRequest(req) == 'blankfield') {
          return res.status(200).json({ returncode: "300", message: "Values can't be blank" });
        }

        const authServiceInstance = Container.get(UserService);
        const { returncode, message, data } = await authServiceInstance.EditUser(req);
        return res.status(200).json({ returncode, message, data });

      } catch (e) {
        const returncode = "300";
        const message = "fail"
        return next({ returncode, message, e });
      }
    },
  );

};