import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providers/fakes/FakeHashProvider';
import FakeJwtProvider from '@modules/users/providers/fakes/FakeJwtProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should not be able to create a user thah already exists', async () => {
        const fakeHashProvider = new FakeHashProvider();
        const fakeJwtProvider = new FakeJwtProvider();
        const fakeUsersRepository = new FakeUsersRepository();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeJwtProvider,
        );

        const firstUser = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
            phones: [JSON.stringify({ numero: '123456789', ddd: '27' })],
        });

        expect(firstUser).toHaveProperty('nome');
        expect(firstUser).toHaveProperty('usuario');
        expect(firstUser).toHaveProperty('token');
        expect(firstUser).toHaveProperty('ultimo_login');

        expect(
            createUser.execute({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '123456',
                phones: [JSON.stringify({ numero: '123456789', ddd: '27' })],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
