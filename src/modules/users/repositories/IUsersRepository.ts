import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dto/ICreateUserDTO';
import IUpdateUserDTO from '../dto/IUpdateUserDTO';
import IFindUserDTO from '../dto/IFindUserDTO';

export default interface IUsersRepository {
    findUserByEmailAndToken(userData: IFindUserDTO): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(userData: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
    update(userData: IUpdateUserDTO): Promise<void>;
}
