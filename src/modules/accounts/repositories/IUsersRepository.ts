import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/Users";


interface IUsersRepository{
    create(data:ICreateUserDTO): Promise<void>;
    findByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
}

export {IUsersRepository}