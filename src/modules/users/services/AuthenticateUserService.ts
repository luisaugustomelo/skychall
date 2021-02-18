// import { compare } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import objectMapper from 'object-mapper';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { find } from '@modules/users/infra/providers/models/UserObjectPattern';

import IHashProvider from '@modules/users/providers/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

/*
 * Gerar md5 - www.md5.cz
 * Inspecionar Token JWT - jwt.io
 */
interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const findUser = await this.usersRepository.findByEmail(email);

        if (!findUser) {
            throw new AppError('Incorrent email/password combination.', 404);
        }

        const passwordMatched = await this.hashProvider.compareHash(
            password,
            findUser.password,
        );

        if (!passwordMatched) {
            throw new AppError('Incorrent email/password combination.', 401);
        }

        const last_seen = new Date();
        await this.usersRepository.update({
            email,
            last_seen: last_seen.toISOString(),
        });

        Object.assign(findUser, { last_seen });

        const user = objectMapper.merge(Object(findUser), find) as User;

        return {
            user,
        };
    }
}

export default AuthenticateUserService;
