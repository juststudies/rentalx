import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";
import { IUserCreateDTO, IUsersRepository } from "../repositories/IUsersRepository";

@injectable()
class CreateUserUseCase{
    constructor(
        @inject("UsersRepository")
        private usersRepository:IUsersRepository
    ){}

    async execute({ name, email, password, driver_license}: IUserCreateDTO): Promise<void>{
        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if(userAlreadyExists){
            throw new Error("User already exists");
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