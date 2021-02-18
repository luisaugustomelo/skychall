import { injectable, inject } from 'tsyringe';
import objectMapper from 'object-mapper';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { signin } from '@modules/users/infra/providers/models/UserObjectPattern';

interface IRequest {
    email: string;
    token: string;
    exp: number;
}

@injectable()
class FindUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ email, token, exp }: IRequest): Promise<User> {
        const findUser = await this.usersRepository.findUserByEmailAndToken({
            email,
            token,
        });

        if (!findUser) {
            throw new AppError('User Unauthorized', 401);
        }

        // token exceeded 30m?
        if (Date.now() >= exp * 1000) {
            throw new AppError('Invalid Session', 401);
        }

        const user = objectMapper.merge(Object(findUser), signin) as User;

        return user;
    }
}
export default FindUserService;
