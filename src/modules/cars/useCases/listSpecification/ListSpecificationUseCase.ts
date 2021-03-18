import { Specification } from "../../model/Specification";
import { ISpecificationRepository } from "../../repositories/ISpecificationsRepository";

class ListSpecificationUseCase {
    constructor(private specificationsRepository: ISpecificationRepository) { }
    execute(): Specification[] {
        const specifications = this.specificationsRepository.list();
        return specifications;
    }
}

export { ListSpecificationUseCase };