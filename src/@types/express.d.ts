declare namespace Express {
    // eslint-disable-next-line
    export interface Request {
        user: {
            token: string;
            exp: number;
        };
    }
}
