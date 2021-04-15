import auth from "@config/auth"
import { sign, verify } from "jsonwebtoken"
import { inject, injectable } from "tsyringe";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { AppErrors } from "@shared/errors/AppErrors";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IPayload{
    sub: string;
    email: string;
}

@injectable()
class RefreshTokenUseCase{
    constructor(
        @inject("UsersTokensRepository")
        private usersTokenRepository: IUsersTokenRepository,

        @inject("DayjsDateProvider")
        private dayjsDateProvider: IDateProvider
    ){}

    async execute(token: string): Promise<string>{
        const {sub, email} = verify(token, auth.secret_refresh_token) as IPayload;

        const user_id = sub;

        const userToken = await this.usersTokenRepository.findByIdAndToken(
            user_id,
            token
        );

        if(!userToken){
            throw new AppErrors("Refresh Tokens does not exists!");
        }

        await this.usersTokenRepository.deleteById(userToken.id);
       
        const refresh_token = sign({email}, auth.secret_refresh_token,{
            subject: sub,
            expiresIn: auth.expires_in_refresh_token
        });

        const expires_date = this.dayjsDateProvider.addDays(
            auth.expires_refresh_days
        );

        await this.usersTokenRepository.create({
            expires_date,
            refresh_token,
            user_id
        });

        return refresh_token;


    }
}

export{RefreshTokenUseCase}