import { Router } from 'express';
import auth from './routes/auth';
import seat from './routes/seat';
import trip from './routes/trip';
import user from './routes/user';
import gate from './routes/gate';
import route from './routes/routes';
import subroute from './routes/subroute';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	seat(app);
	trip(app);
	gate(app);
	route(app);
	subroute(app);
	return app
}