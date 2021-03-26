import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken"
import { UsersRepository } from "../../repositories/implementations/UsersRepository";

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
class AuthenticateUserUserCase{
    constructor(
        @inject("UsersRepository")
        private usersRepository: UsersRepository
    ){}
    async execute({email, password}: IRequest): Promise<IResponse>{
        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new Error("Email or password incorrect!");
        }

        const passwordMatch = compare(password, user.password);
        
        if(!passwordMatch){
            throw new Error("Email or password incorrect!");
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

export { AuthenticateUserUserCase }