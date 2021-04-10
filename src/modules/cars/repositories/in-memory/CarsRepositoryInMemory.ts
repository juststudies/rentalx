import { ICreateCarDTO } from "@modules/cars/dto/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository{
    
    cars: Car[] = [];
    
    async create({
        brand,
        name,
        license_plate,
        description,
        daily_rate,
        category_id,
        fine_amount,
        id
    }: ICreateCarDTO): Promise<Car> {
        const car = new Car();

        Object.assign(car, {
            brand,
            name,
            license_plate,
            description,
            daily_rate,
            category_id,
            fine_amount,
            id
        });
        
        this.cars.push(car);
        return car;
    }
    
    async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.cars.find(car=> car.license_plate === license_plate);
    }

    async findAvailable(
        brand?: string,
        category_id?: string,
        name?: string
    ): Promise<Car[]> {

        const availableCars = this.cars
        .filter(
            car => {
                if(car.available === true || 
                    (
                        brand && car.brand === brand ||
                        name && car.name === name || 
                        category_id && car.category_id == category_id
                    )
                ){
                    return car;
                }
                return null;
                
            });

            return availableCars;
        }
        
        async findById(id: string): Promise<Car>{
            return this.cars.find(car => car.id === id);
        }
        
        async updateAvailable(id: string, available: boolean): Promise<void> {
            const findIndex = this.cars.findIndex(car => car.id === id);
            this.cars[findIndex].available = available
        }
}

export{CarsRepositoryInMemory}