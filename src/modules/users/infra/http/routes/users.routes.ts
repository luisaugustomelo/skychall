import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import UsersController from '@modules/users/infra/http/controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/signup', usersController.create);

usersRouter.get('/finduser', ensureAuthenticated, usersController.find);

export default usersRouter;
