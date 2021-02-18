import { Router } from 'express';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.get('/', (request, response) => {
    return response.json({ status: true });
});

sessionsRouter.post('/signin', sessionsController.create);

export default sessionsRouter;
