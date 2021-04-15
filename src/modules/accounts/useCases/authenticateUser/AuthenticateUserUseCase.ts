import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken"
import { AppErrors } from "@shared/errors/AppErrors";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IRequest{
    email: string;
    password: string;
}

interface IResponse{
    user:{
        name: string;
        email:string;
    };
    token: string;
    refresh_token: string;
    
}

@injectable()
class AuthenticateUserUseCase{
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokenRepository,

        @inject("DayjsDateProvider")
        private dayjsDateProvider: IDateProvider
        
    ){}
    async execute({email, password}: IRequest): Promise<IResponse>{
        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new AppErrors("Email or password incorrect!");
        }

        const passwordMatch = await compare(password, user.password);
        
        if(!passwordMatch){
            throw new AppErrors("Email or password incorrect!");
        }

        const token = sign({}, auth.secret_token, {
            subject: user.id,
            expiresIn: auth.expires_in_token
        });

        const refresh_token = sign({email}, auth.secret_refresh_token, {
            subject: user.id,
            expiresIn: auth.expires_in_refresh_token
        });

        const refresh_token_expires_date = this.dayjsDateProvider.addDays(auth.expires_refresh_days)

        await this.usersTokensRepository.create({
            user_id: user.id,
            refresh_token,
            expires_date: refresh_token_expires_date
        });

        const tokenReturn: IResponse = {
            token,
            user:{
                name: user.name,
                email: user.email
            },
            refresh_token
        }

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase }