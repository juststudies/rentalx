import { SpecificationsRepository } from "../repositories/implementations/SpecificationsRepository";

interface IRequest {
    name: string,
    description: string,
}

class CreateSpecificationService {
    constructor(private specificationsRepository: SpecificationsRepository) { }
    execute({ name, description }: IRequest): void {
        const specificationAlreadyExists = this.specificationsRepository.findByName(name);
        if (specificationAlreadyExists) {
            throw new Error("Specifications Already Exists");
        }
        this.specificationsRepository.create({ name, description });
    }
}

export { CreateSpecificationService }