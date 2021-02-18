import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providers/fakes/FakeHashProvider';
import FakeJwtProvider from '@modules/users/providers/fakes/FakeJwtProvider';
import CreateUserService from './CreateUserService';
import FindUserService from './FindUserService';

describe('CreateUser', () => {
    it('should be able to finduser and check if exists user', async () => {
        const fakeHashProvider = new FakeHashProvider();
        const fakeJwtProvider = new FakeJwtProvider();
        const fakeUsersRepository = new FakeUsersRepository();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeJwtProvider,
        );

        const findUser = new FindUserService(fakeUsersRepository);

        const newUser = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
            phones: [JSON.stringify({ numero: '123456789', ddd: '27' })],
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const convertUserToObject = newUser as any;
        const { usuario, token } = convertUserToObject;

        const user = await findUser.execute({
            email: usuario,
            token,
            exp: Date.now(),
        });

        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('token');
    });

    it('should be able to not authorized user', async () => {
        const fakeHashProvider = new FakeHashProvider();
        const fakeJwtProvider = new FakeJwtProvider();
        const fakeUsersRepository = new FakeUsersRepository();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeJwtProvider,
        );

        const findUser = new FindUserService(fakeUsersRepository);

        const newUser = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
            phones: [JSON.stringify({ numero: '123456789', ddd: '27' })],
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const convertUserToObject = newUser as any;
        const { usuario } = convertUserToObject;

        expect(
            findUser.execute({
                email: usuario,
                token: 'xaxaxa',
                exp: new Date().getTime(),
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to access invalid session', async () => {
        const fakeHashProvider = new FakeHashProvider();
        const fakeJwtProvider = new FakeJwtProvider();
        const fakeUsersRepository = new FakeUsersRepository();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeJwtProvider,
        );

        const findUser = new FindUserService(fakeUsersRepository);

        const newUser = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
            phones: [JSON.stringify({ numero: '123456789', ddd: '27' })],
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const convertUserToObject = newUser as any;
        const { usuario, token } = convertUserToObject;

        expect(
            findUser.execute({
                email: usuario,
                token,
                exp: Date.now() / 2000,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
