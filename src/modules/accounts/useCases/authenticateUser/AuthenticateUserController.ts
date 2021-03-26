import {Request, Response} from "express";
import { container } from "tsyringe";
import { AuthenticateUserUserCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController{
    async handle(request: Request, response:Response): Promise<Response>{
        const {password, email} = request.body;

        const authenticateUserUserCase = container.resolve(AuthenticateUserUserCase);
        const token = await authenticateUserUserCase.execute({password, email});
        return response.json(token);
    }
}

export {AuthenticateUserController}