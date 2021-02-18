import { getMongoRepository, MongoRepository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dto/ICreateUserDTO';
import IUpdateUserDTO from '@modules/users/dto/IUpdateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import IFindUserDTO from '@modules/users/dto/IFindUserDTO';

class UsersRepository implements IUsersRepository {
    private ormRepository: MongoRepository<User>;

    constructor() {
        this.ormRepository = getMongoRepository(User);
    }

    public async findUserByEmailAndToken({
        email,
        token,
    }: IFindUserDTO): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ email, token });

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({
            where: { email },
        });

        return user;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(userData);

        await this.ormRepository.save(user);
        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }

    public async update({ email, last_seen }: IUpdateUserDTO): Promise<void> {
        this.ormRepository.update({ email }, { last_seen });
    }
}

export default UsersRepository;
