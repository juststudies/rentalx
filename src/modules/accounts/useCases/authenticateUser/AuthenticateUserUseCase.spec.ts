import { AppErrors } from '@shared/errors/AppErrors';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../CreateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", ()=>{

    beforeEach(()=>{
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to authenticate an user", async()=>{
        const user: ICreateUserDTO = {
            name: "User name test",
            driver_license: "000123",
            email: "user@test.com",
            password: "1234"
        }

        await createUserUseCase.execute(user);
        
        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");

    });

    it("should not be able to authenticate an inexisting user", async ()=>{
        await expect(authenticateUserUseCase.execute({
                email: "false@test.com",
                password: "1234",
            })
        ).rejects.toEqual(new AppErrors("Email or password incorrect!"));
    });

    it("should not be able to authenticate with wrong password", async ()=>{
        const user: ICreateUserDTO = {
            name: "User name test Error",
            driver_license: "000456",
            email: "error@test.com",
            password: "7894"
        }

        await createUserUseCase.execute(user);
        
        await expect(
            authenticateUserUseCase.execute({
                email: user.email, 
                password: "incorrect"
            })
        ).rejects.toEqual(new AppErrors("Email or password incorrect!"));
    });
});