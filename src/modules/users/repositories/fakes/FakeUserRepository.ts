import { uuid } from 'uuidv4';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dto/ICreateUserDTO';
import IFindUserDTO from '@modules/users/dto/IFindUserDTO';
import IUpdateUserDTO from '@modules/users/dto/IUpdateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findUserByEmailAndToken({
        email,
        token,
    }: IFindUserDTO): Promise<User | undefined> {
        const findUser = await this.users.find(
            user => user.email === email && user.token === token,
        );

        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = await this.users.find(user => user.email === email);

        return findUser;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();
        Object.assign(user, { id: uuid(), ...userData });

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(
            findUser => findUser.id === user.id,
        );

        this.users[findIndex] = user;

        return user;
    }

    public async update({ email, last_seen }: IUpdateUserDTO): Promise<void> {
        const findIndex = this.users.findIndex(
            findUser => findUser.email === email,
        );

        this.users[findIndex].last_seen = new Date(last_seen);
    }
}

export default FakeUsersRepository;
