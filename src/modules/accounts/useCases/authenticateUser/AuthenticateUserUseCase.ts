import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken"
import { AppErrors } from "@shared/errors/AppErrors";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

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
}

@injectable()
class AuthenticateUserUseCase{
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
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

        const token = sign({}, "5f75c99215711a703663174ec2ae4979", {
            subject: user.id,
            expiresIn: "1d"
        });

        const tokenReturn: IResponse = {
            token,
            user:{
                name: user.name,
                email: user.email
            }
        }

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase }