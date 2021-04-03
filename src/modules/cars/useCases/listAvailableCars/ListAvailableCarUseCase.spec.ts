import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarUseCase } from "./ListAvailableCarUseCase";

let listAvailableCarUseCase: ListAvailableCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List cars", ()=>{
    beforeEach(()=>{
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        listAvailableCarUseCase = new ListAvailableCarUseCase(carsRepositoryInMemory);
    });

    it("should be able to list all available cars", async ()=>{
       const availableCar = await carsRepositoryInMemory.create({
        name: "Car1",
        description: "Car Description",
        brand: "brand",
        daily_rate: 110,
        license_plate: "XXXXX",
        fine_amount:60,
        category_id: "category_id"
       });

       const cars = await listAvailableCarUseCase.execute({});

       expect(cars).toEqual([availableCar]);
    });

    it("should be able to list all available cars by brand", async ()=>{
        const availableCarByBrand = await carsRepositoryInMemory.create({
            name: "Car2",
            description: "Car Description",
            brand: "Brand Test",
            daily_rate: 110,
            license_plate: "XXXXX",
            fine_amount:60,
            category_id: "category_id"
           });
        
        const cars = await listAvailableCarUseCase.execute({
            brand: "Brand Test"
        });

        expect(cars).toEqual([availableCarByBrand]);
    });

    it("should be able to list all available cars by name", async ()=>{
        const availableCarByName = await carsRepositoryInMemory.create({
            name: "Car3",
            description: "Car3 Description",
            brand: "just a brand",
            daily_rate: 110,
            license_plate: "ASD-4645",
            fine_amount:60,
            category_id: "category_id"
           });
        
        const cars = await listAvailableCarUseCase.execute({
            name: "Car3"
        });

        expect(cars).toEqual([availableCarByName]);
    });

    it("should be able to list all available cars by category", async ()=>{
        const availableCarByCategory = await carsRepositoryInMemory.create({
            name: "Car3",
            description: "Car3 Description",
            brand: "just a brand",
            daily_rate: 110,
            license_plate: "ASD-4645",
            fine_amount:60,
            category_id: "132456"
           });
        
        const cars = await listAvailableCarUseCase.execute({
            category_id: "132456"
        });

        expect(cars).toEqual([availableCarByCategory]);
    });
});