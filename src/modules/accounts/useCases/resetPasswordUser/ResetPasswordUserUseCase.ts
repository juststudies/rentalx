import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppErrors } from "@shared/errors/AppErrors";

interface IRequest{
    token: string;
    password: string;
}

@injectable()
class ResetPasswordUserUseCase{
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokenRepository,

        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,

        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ){}

    async execute({
        password,
        token
    }:IRequest){
        const userToken = await this.usersTokensRepository.findByRefreshToken(token);
        
        if(!userToken){
            throw new AppErrors("Token does not exists");
        }
        
        if(this.dateProvider.compareIfBefore(
            userToken.expires_date, 
            this.dateProvider.dateNow()
        )){
            throw new AppErrors("Token expired");
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        user.password = await hash(password, 8);

        await this.usersRepository.create(user);

        await this.usersTokensRepository.deleteById(userToken.id);

    }
}

export{ ResetPasswordUserUseCase }