import { getRepository, Repository } from "typeorm";
import { IUserCreateDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/Users";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepository implements IUsersRepository{
    private repository: Repository<User>;
    
    constructor(){
        this.repository = getRepository(User);
    }

    async create({name, email, password, driver_license}: IUserCreateDTO):Promise<void>{
        const user = this.repository.create({
            name,
            email,
            password,
            driver_license
        });

        await this.repository.save(user);
    }

    async findByEmail(email: string): Promise<User>{
        const user = await this.repository.findOne({email});
        return user
    }
}

export { UsersRepository };