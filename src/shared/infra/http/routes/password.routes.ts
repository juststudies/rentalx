import {Router} from "express";
import {SendForgotPasswordMailController} from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController"
import { ResetPasswordUserController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController";

const passwordRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
passwordRoutes.post("/forgot", sendForgotPasswordMailController.handle);

const resetPasswordUserController = new ResetPasswordUserController();
passwordRoutes.post("/reset", resetPasswordUserController.handle);

export{passwordRoutes};