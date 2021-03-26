import { Router } from 'express';
import multer from 'multer';

import { CreateCategoryController } from '../modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoryController } from '../modules/cars/useCases/importCategory/ImportCategoryController';
import { ListCategoryController } from '../modules/cars/useCases/listCategory/ListCategoryController';


const categoriesRoutes = Router();
const upload = multer({
    dest: "./tmp",
});

const createCategoryController = new CreateCategoryController();
categoriesRoutes.post('/', createCategoryController.handle);

const listCategoryController = new ListCategoryController();
categoriesRoutes.get('/', listCategoryController.handle);

const importCategoryController = new ImportCategoryController();
categoriesRoutes.post('/import', upload.single("file"), importCategoryController.handle);

export { categoriesRoutes };