import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providers/fakes/FakeHashProvider';
import FakeJwtProvider from '@modules/users/providers/fakes/FakeJwtProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate a new user', async () => {
        const fakeHashProvider = new FakeHashProvider();
        const fakeJwtProvider = new FakeJwtProvider();
        const fakeUsersRepository = new FakeUsersRepository();

        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeJwtProvider,
        );

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
            phones: [JSON.stringify({ numero: '123456789', ddd: '27' })],
        });

        const auth = await authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(user).toHaveProperty('nome');
        expect(user).toHaveProperty('usuario');
        expect(user).toHaveProperty('token');
        expect(user).toHaveProperty('ultimo_login');

        expect(auth.user).toHaveProperty('id');
        expect(auth.user).toHaveProperty('usuario');
        expect(auth.user).toHaveProperty('token');
        expect(auth.user).toHaveProperty('ultimo_login');

        expect(auth.user).not.toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        expect(
            authenticateUser.execute({
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate with wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeJwtProvider = new FakeJwtProvider();
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const createuser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeJwtProvider,
        );

        await createuser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
            phones: [JSON.stringify({ numero: '123456789', ddd: '27' })],
        });

        expect(
            authenticateUser.execute({
                email: 'johndoe@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
