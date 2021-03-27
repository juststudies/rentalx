import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../entities/Users";

interface IUsersRepository{
<<<<<<< HEAD
    create(data:ICreateUserDTO): Promise<void>;
=======
    create(data:IUserCreateDTO): Promise<void>;
>>>>>>> 46a039c97227bff601c7c9724993af93756e10a5
    findByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
}

export {IUsersRepository, ICreateUserDTO}