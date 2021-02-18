import { container } from 'tsyringe';

import IHashProvider from '@modules/users/providers/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/implementations/BCryptHashProvider';

import IJwtProvider from '@modules/users/providers/models/IJwtProvider';
import JwtProvider from '@modules/users/providers/implementations/JwtProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<IJwtProvider>('JwtProvider', JwtProvider);
