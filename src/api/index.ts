import { Router } from 'express';
import auth from './routes/auth';
import seat from './routes/seat';
import trip from './routes/trip';
import user from './routes/user';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	seat(app);
	trip(app);

	return app
}