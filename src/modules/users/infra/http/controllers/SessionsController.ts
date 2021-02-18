import { Request, Response } from 'express';

import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { email, senha } = request.body;
            const password = senha;

            const autenticateUser = container.resolve(AuthenticateUserService);

            const { user } = await autenticateUser.execute({
                email,
                password,
            });

            return response.json(user);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}
