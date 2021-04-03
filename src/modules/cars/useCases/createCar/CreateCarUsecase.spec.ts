import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppErrors } from "@shared/errors/AppErrors";
import { CreateCarUseCase } from "./CreateCarUseCase"

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create a car", ()=>{
    beforeEach(()=>{
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    })
    it("should be able to createa a car", async()=>{
        const car = await createCarUseCase.execute({
            brand:"Brand",
            category_id:"category",
            daily_rate:100,
            description: "Description Car",
            fine_amount: 60,
            license_plate: "ABC-1234",
            name: "Name Car"
        });

        expect(car).toHaveProperty("id");
    });

    it("should not be able to create a car with an existing license plate", ()=>{
        expect(async()=>{
            await createCarUseCase.execute({
                brand:"Brand",
                category_id:"category",
                daily_rate:100,
                description: "Description Car",
                fine_amount: 60,
                license_plate: "ABC-1234",
                name: "Name Car"
            });
            
            await createCarUseCase.execute({
                brand:"Brand ",
                category_id:"category",
                daily_rate:100,
                description: "Description Car",
                fine_amount: 60,
                license_plate: "ABC-1234",
                name: "Name Car 2"
            });
        }).rejects.toBeInstanceOf(AppErrors);
    });

    it("should be able to create a car with licesen plate true by default", async()=>{
        const car = await createCarUseCase.execute({
            name: "Name Car available",
            brand:"Brand",
            category_id:"category",
            daily_rate:100,
            description: "Description Car",
            fine_amount: 60,
            license_plate: "ABC-1234",
        });

        expect(car.available).toBe(true);

    });
});