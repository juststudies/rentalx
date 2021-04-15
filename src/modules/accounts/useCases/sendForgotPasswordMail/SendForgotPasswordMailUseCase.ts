import { inject, injectable } from "tsyringe";
import {v4 as uuidV4} from "uuid";
import {resolve} from "path"

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { AppErrors } from "@shared/errors/AppErrors";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

@injectable()
class SendForgotPasswordMailUseCase{
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("UsersTokensRepository")
        private usersTokenRepository: IUsersTokenRepository,

        @inject("DayjsDateProvider")
        private dayJsDateProvider: IDateProvider,

        @inject("EtherealMailProvider")
        private mailProvider: IMailProvider
    ){

    }

    async execute(email: string): Promise<void>{
        const user = await this.usersRepository.findByEmail(email);
        const templatePath = resolve(
            __dirname,
            "..",
            "..",
            "views",
            "emails",
            "forgot.hbs"
        );

        if(!user){
            throw new AppErrors("User does not exists");
        }

        const token = uuidV4();

        const expires_date = this.dayJsDateProvider.addHours(3);

        await this.usersTokenRepository.create({
            user_id: user.id,
            refresh_token: token,
            expires_date
        });

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`
        }

        await this.mailProvider.sendMail(
            email,
            "Recuperação de senha",
            variables,
            templatePath
        )
    }
}

export{SendForgotPasswordMailUseCase}