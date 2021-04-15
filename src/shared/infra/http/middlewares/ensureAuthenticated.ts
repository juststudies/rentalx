import {Request, Response, NextFunction} from "express";
import {verify} from "jsonwebtoken";
import { AppErrors } from "@shared/errors/AppErrors";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import auth from "@config/auth";

interface IPayload{
    sub: string;
}

export async function ensureAuthenticated(request:Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization;

    const usersTokenRepository = new UsersTokensRepository();

    if(!authHeader){
        throw new AppErrors("Token missing", 401)
    }

    const [, token] = authHeader.split(" ");
    try {
        const { sub: user_id } = verify(
            token,
            auth.secret_refresh_token
        ) as IPayload;

        // const usersRepository = new UsersRepository();
        const user = usersTokenRepository.findByIdAndToken(
            user_id,
            token
        );

        if(!user){
            throw new AppErrors("User does not exists", 401);
        }

        request.user = {
            id: user_id
        };
        
        next();
    } catch {
        throw new AppErrors("Invalid token", 401);
    }
}