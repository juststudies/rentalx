import { inject, injectable } from "tsyringe";
import { AppErrors } from "@shared/errors/AppErrors";
import { SpecificationsRepository } from "@modules/cars/infra/typeorm/repositories/SpecificationsRepository";

interface IRequest {
    name: string,
    description: string,
}

@injectable()
class CreateSpecificationUseCase {
    constructor(
        @inject("SpecificationsRepository")    
        private specificationsRepository: SpecificationsRepository
    ) { }
    async execute({ name, description }: IRequest): Promise<void> {
        const specificationAlreadyExists = await this.specificationsRepository.findByName(name);
        if (specificationAlreadyExists) {
            throw new AppErrors("Specifications Already Exists");
        }
        this.specificationsRepository.create({ name, description });
    }
}

export { CreateSpecificationUseCase }