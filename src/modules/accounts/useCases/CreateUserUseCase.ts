import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";
import { ICreateUserDTO, IUsersRepository } from "../repositories/IUsersRepository";
import { AppErrors } from "../../../errors/AppErrors";

@injectable()
class CreateUserUseCase{
    constructor(
        @inject("UsersRepository")
        private usersRepository:IUsersRepository
    ){}

    async execute({ name, email, password, driver_license}: ICreateUserDTO): Promise<void>{
        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if(userAlreadyExists){
            throw new AppErrors("User already exists");
        }

        const passwordHash = await hash(password, 8);
        await this.usersRepository.create({
            name,
            email,
            password: passwordHash,
            driver_license
        });
    }
}

export {CreateUserUseCase}