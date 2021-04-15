import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { getRepository, Repository } from "typeorm";
import { UserTokens } from "../entities/UserTokens";

class UsersTokensRepository implements IUsersTokenRepository{
    private repository: Repository<UserTokens>;

    constructor(){
        this.repository = getRepository(UserTokens)
    }
    
    async create({ 
        expires_date,
        refresh_token,
        user_id
    }: ICreateUserTokenDTO): Promise<UserTokens> {
        const userTokens = this.repository.create({
            expires_date,
            refresh_token,
            user_id
        });
        
        await this.repository.save(userTokens);
        
        return userTokens;
    }
    
    async findByIdAndToken(user_id: string, refresh_token: string): Promise<UserTokens> {
        const userTokens = await this.repository.findOne({
            user_id,
            refresh_token
        });
        return userTokens;
    }
    
    async deleteById(userToken_id: string): Promise<void> {
        await this.repository.delete(userToken_id);
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = await this.repository.findOne({refresh_token});

        return userToken;
    }
    
}

export {UsersTokensRepository}