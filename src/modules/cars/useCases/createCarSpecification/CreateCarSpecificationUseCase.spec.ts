import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationRepositoryInMemory";
import { AppErrors } from "@shared/errors/AppErrors";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationRepositoryInMemory: SpecificationRepositoryInMemory;

describe("Create Car Specification", ()=>{
    beforeEach(()=>{
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        specificationRepositoryInMemory = new SpecificationRepositoryInMemory()
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory, specificationRepositoryInMemory
        );
    });

    it("should not be able to add a new specification to a non existent car", async ()=>{
        const car_id = "1234";
        const specifications_id= ['54321'];
        
        await expect(
            createCarSpecificationUseCase.execute({car_id, specifications_id})
        ).rejects.toEqual(new AppErrors("Car does not exists!"));
    });

    it("should be able to add a new specification to the car", async ()=>{
        const car = await carsRepositoryInMemory.create({
            brand:"Brand",
            category_id:"category",
            daily_rate:100,
            description: "Description Car",
            fine_amount: 60,
            license_plate: "ABC-1234",
            name: "Name Car"
        });

        const specification = await specificationRepositoryInMemory.create({
            description: "test",
            name: "test"
        });

        const specifications_id = [specification.id]

        const carSpecification = await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specifications_id
        });
        
        expect(carSpecification).toHaveProperty("specifications");
        expect(carSpecification.specifications.length).toBe(1);

    });
})