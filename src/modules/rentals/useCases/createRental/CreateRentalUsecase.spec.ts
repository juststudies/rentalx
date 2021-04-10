import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppErrors } from "@shared/errors/AppErrors";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider

describe("Create Rental", ()=>{
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    beforeEach(()=>{
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider()
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );
    });

    it("should be able to create a new rental", async ()=>{
        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: "121212",
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", ()=>{
        expect(async ()=>{
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "121212",
                expected_return_date: dayAdd24Hours,
            });
    
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "131254",
                expected_return_date: dayAdd24Hours,
            });
        }).rejects.toBeInstanceOf(AppErrors);
    });

    it("should not be able to create a new rental if there is another open to the same car", ()=>{
        expect(async ()=>{
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "151515",
                expected_return_date: dayAdd24Hours,
            });
    
            await createRentalUseCase.execute({
                user_id: "12349",
                car_id: "151515",
                expected_return_date: dayAdd24Hours,
            });
        }).rejects.toBeInstanceOf(AppErrors);
    });

    it("should not be able to create a new rental with invalid return time", ()=>{
        expect(async ()=>{   
            await createRentalUseCase.execute({
                user_id: "12349",
                car_id: "151515",
                expected_return_date: dayjs().toDate(),
            });
        }).rejects.toBeInstanceOf(AppErrors);
    });
});