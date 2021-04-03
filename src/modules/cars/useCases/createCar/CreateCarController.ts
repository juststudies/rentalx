import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCarUseCase } from "./CreateCarUseCase";

class CreateCarController{
    async handle(request: Request, response: Response): Promise<Response>{
        const {        
            name,
            description,
            brand,
            daily_rate,
            license_plate,
            fine_amount,
            category_id,
        } = request.body

        const createCarUseCase = container.resolve(CreateCarUseCase);

        const car = await createCarUseCase.execute({
            name,
            description,
            brand,
            daily_rate,
            license_plate,
            fine_amount,
            category_id,
        });

        return response.status(201).json(car);
    }
}

export{CreateCarController}