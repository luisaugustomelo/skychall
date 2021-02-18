import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import IJwtProvider from '@modules/users/providers/models/IJwtProvider';

export default class JwtProvider implements IJwtProvider {
    public async sign(user: string): Promise<string> {
        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user,
            expiresIn,
        });

        return token;
    }
}
