import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokenRepository{
    create({
        expires_date,
        user_id,
        refresh_token
    }: ICreateUserTokenDTO): Promise<UserTokens>

    findByIdAndToken(
        user_id: string, 
        refresh_token: string
    ): Promise<UserTokens>

    deleteById(userToken_id: string): Promise<void>;

    findByRefreshToken(refresh_token: string): Promise<UserTokens>
}

export {IUsersTokenRepository}