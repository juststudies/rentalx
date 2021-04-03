import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppErrors } from "@shared/errors/AppErrors";
import { inject, injectable } from "tsyringe";

interface IRequest{
    name: string;
    description: string;
    daily_rate: number;
    license_plate: string;
    fine_amount: number;
    brand: string;
    category_id: string;
}

@injectable()
class CreateCarUseCase{
    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository
    ){}
    async execute({
        name,
        description,
        brand,
        daily_rate,
        license_plate,
        fine_amount,
        category_id,
    }:IRequest):Promise<Car>{

            const carAlreadyExists = await this.carsRepository.findByLicensePlate(license_plate);

            if(carAlreadyExists){
                throw new AppErrors("Car already exists");
            }

            const car = this.carsRepository.create({
                name,
                description,
                brand,
                daily_rate,
                license_plate,
                fine_amount,
                category_id,
            });

            return car;
        }
}

export {CreateCarUseCase}