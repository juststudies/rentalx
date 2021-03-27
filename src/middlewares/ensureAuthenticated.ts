import {Request, Response, NextFunction} from "express";
import {verify} from "jsonwebtoken";
import { AppErrors } from "../errors/AppErrors";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload{
    sub: string;
}

export async function ensureAuthenticated(request:Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization;
    if(!authHeader){
        throw new AppErrors("Token missing", 401)
    }

    const [, token] = authHeader.split(" ");
    try {
        const { sub: user_id } = verify(token, "5f75c99215711a703663174ec2ae4979") as IPayload;
        const usersRepository = new UsersRepository();
        const user = usersRepository.findById(user_id);

        if(!user){
            throw new AppErrors("User does not exists", 401);
        }
        next();
    } catch {
        throw new AppErrors("Invalid token", 401);
    }
}