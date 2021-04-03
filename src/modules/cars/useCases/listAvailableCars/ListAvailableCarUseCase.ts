import { inject, injectable } from "tsyringe";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

interface IRequest{
    category_id?: string;
    name?: string;
    brand?: string;
}

@injectable()
class ListAvailableCarUseCase{
    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository
    ){}

    async execute({
        brand,
        category_id,
        name
    }:IRequest):Promise<Car[]>{
        
        const carsAvailable = this.carsRepository.findAvailable(
            brand,
            category_id,
            name
        );

        return carsAvailable;
    }
}

export{ListAvailableCarUseCase}