export default interface ICreateUserDTO {
    name: string;
    email: string;
    password: string;
    token: string;
    phones: Array<string>;
    last_seen: string;
}
