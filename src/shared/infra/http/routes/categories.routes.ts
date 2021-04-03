import { Router } from 'express';
import multer from 'multer';

import { CreateCategoryController } from '@modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoryController } from '@modules/cars/useCases/importCategory/ImportCategoryController';
import { ListCategoryController } from '@modules/cars/useCases/listCategory/ListCategoryController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
import { ensureAdmin } from '@shared/infra/http/middlewares/ensureAdmin';

const categoriesRoutes = Router();
const upload = multer({
    dest: "./tmp",
});

const createCategoryController = new CreateCategoryController();
categoriesRoutes.post('/', ensureAuthenticated, ensureAdmin, createCategoryController.handle);

const listCategoryController = new ListCategoryController();
categoriesRoutes.get('/', listCategoryController.handle);

const importCategoryController = new ImportCategoryController();
categoriesRoutes.post('/import', upload.single("file"), importCategoryController.handle);

export { categoriesRoutes };