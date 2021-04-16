import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { IUsersTokenRepository } from "../IUsersTokenRepository";

class UsersTokenRepositoryInMemory implements IUsersTokenRepository{
    usersTokens: UserTokens[] = []
    async create({ expires_date, user_id, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens> {
        const userToken = new UserTokens();

        Object.assign(userToken, {
            user_id,
            expires_date,
            refresh_token
        });

        this.usersTokens.push(userToken);
        
        return userToken;
    }

    async findByIdAndToken(user_id: string, refresh_token: string): Promise<UserTokens> {
        const userToken = this.usersTokens.find(
            ut => ut.user_id === user_id &&
            ut.refresh_token === refresh_token
        );

        return userToken;
    }

    async deleteById(user_id: string): Promise<void> {
        const userToken = this.usersTokens.find(
            ut => ut.user_id === user_id
        );

        this.usersTokens.splice(this.usersTokens.indexOf(userToken));
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = this.usersTokens.find(
            ut => ut.refresh_token === refresh_token
        );

        return userToken;
    }

}

export{UsersTokenRepositoryInMemory}