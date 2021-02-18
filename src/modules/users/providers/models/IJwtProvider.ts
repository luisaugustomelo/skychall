export default interface IJwtProvider {
    sign(user: string): Promise<string>;
}
