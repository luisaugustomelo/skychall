import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import FindUserService from '@modules/users/services/FindUserService';

export default class UsersController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const {
                nome: name,
                email,
                senha: password,
                telefones: phones,
            } = request.body;

            const createUser = container.resolve(CreateUserService);

            const user = await createUser.execute({
                name,
                email,
                password,
                phones,
            });

            return response.json(user);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }

    public async find(request: Request, response: Response): Promise<Response> {
        try {
            const { user_id: email } = request.query;
            const { token, exp } = request.user;

            const findUser = container.resolve(FindUserService);

            const user = await findUser.execute({
                email: String(email),
                token,
                exp,
            });

            return response.json(user);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}
