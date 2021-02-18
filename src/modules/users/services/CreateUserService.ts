import { injectable, inject } from 'tsyringe';
import objectMapper from 'object-mapper';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/models/IHashProvider';
import IJwtProvider from '@modules/users/providers/models/IJwtProvider';

import AppError from '@shared/errors/AppError';

import { signup } from '@modules/users/infra/providers/models/UserObjectPattern';

interface IRequest {
    name: string;
    email: string;
    password: string;
    phones: Array<string>;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
        @inject('JwtProvider')
        private jwtProvider: IJwtProvider,
    ) {}

    public async execute({
        name,
        email,
        password,
        phones,
    }: IRequest): Promise<User | undefined> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('Email address already used.', 401);
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const token = await this.jwtProvider.sign(email);

        const last_seen = new Date().toISOString();

        const createUser = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
            token,
            phones,
            last_seen,
        });

        const user = objectMapper.merge(Object(createUser), signup) as User;

        return user;
    }
}
export default CreateUserService;
