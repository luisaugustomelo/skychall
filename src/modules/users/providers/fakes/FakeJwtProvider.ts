import IJwtProvider from '../models/IJwtProvider';

export default class FakeJwtProvider implements IJwtProvider {
    public async sign(user: string): Promise<string> {
        return user;
    }
}
