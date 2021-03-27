import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";
<<<<<<< HEAD
import { ICreateUserDTO, IUsersRepository } from "../repositories/IUsersRepository";
=======
import { IUserCreateDTO, IUsersRepository } from "../repositories/IUsersRepository";
>>>>>>> 46a039c97227bff601c7c9724993af93756e10a5
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