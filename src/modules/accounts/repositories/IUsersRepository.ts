import { IUserCreateDTO } from "../dtos/ICreateUserDTO";
import { User } from "../entities/Users";

interface IUsersRepository{
    create(data:IUserCreateDTO): Promise<void>;
    findByEmail(email: string): Promise<User>
}

export {IUsersRepository, IUserCreateDTO}