import { Request, Response } from "express";
import { ListCategoryUseCase } from "./ListCategoryUseCase";

class ListCategoryController {
    constructor(private listCategoriesUseCase: ListCategoryUseCase) { }
    handle(request: Request, response: Response): Response {
        const all = this.listCategoriesUseCase.execute();
        return response.json(all);
    }
}

export { ListCategoryController };