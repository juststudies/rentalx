import { Request, Response } from "express";
import { container } from "tsyringe";
import { CarReturnUseCase } from "./CarReturnUseCase";

class CarReturnController{
    async handle(request: Request, response: Response):Promise<Response>{
        const { id: user_id } = request.user;
        const { id } = request.params;

        const carReturnUseCase = container.resolve(CarReturnUseCase);

        const rental = await carReturnUseCase.execute({
            id,
            user_id
        });

        return response.status(200).json(rental);
    }
}

export {CarReturnController}