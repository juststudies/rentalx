import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppErrors } from "@shared/errors/AppErrors";
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider

describe("Create Rental", ()=>{
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    beforeEach(()=>{
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider()
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );
    });

    it("should be able to create a new rental", async ()=>{
        const car = await carsRepositoryInMemory.create({
            name: "Car name test",
            description: "Car description test",
            daily_rate: 110,
            license_plate: "COC-1241",
            fine_amount:60,
            category_id: "test",
            brand: "brand"
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12314",
            car_id: car.id,
            expected_return_date: dayAdd24Hours
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", ()=>{
        expect(async ()=>{
            const car = await carsRepositoryInMemory.create({
                name: "Car name test",
                description: "Car description test",
                daily_rate: 110,
                license_plate: "COC-1241",
                fine_amount:60,
                category_id: "test",
                brand: "brand"
            });

            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: car.id,
                expected_return_date: dayAdd24Hours,
            });
    
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "131254",
                expected_return_date: dayAdd24Hours,
            });
        }).rejects.toEqual(new AppErrors("There's a rental in progress for user!"));
    });

    it("should not be able to create a new rental if there is another open to the same car", async ()=>{
        const car = await carsRepositoryInMemory.create({
            name: "Car name test",
            description: "Car description test",
            daily_rate: 110,
            license_plate: "COC-1241",
            fine_amount:60,
            category_id: "test",
            brand: "brand"
        });
        
        await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(createRentalUseCase.execute({
                user_id: "12349",
                car_id: car.id,
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppErrors("Car is unavailable"));
    });

    it("should not be able to create a new rental with invalid return time", async ()=>{
        const car = await carsRepositoryInMemory.create({
            name: "Car name test",
            description: "Car description test",
            daily_rate: 110,
            license_plate: "COC-1241",
            fine_amount:60,
            category_id: "test",
            brand: "brand"
        });

        await expect(createRentalUseCase.execute({
                user_id: "12349",
                car_id: car.id,
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppErrors("Invalid return time!"));
    });
});