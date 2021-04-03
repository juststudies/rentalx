import { Router } from "express";
import multer from "multer";
import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController";
import { UploadCarsImagesController } from "@modules/cars/useCases/uploadCarImages/UploadCarsImagesController";
import { ListAvailableCarController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarController";
import uploadConfig from "@config/upload";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const carsRoutes = Router();

const uploadCarImage = multer(uploadConfig.upload("./tmp/cars"));

const createCarController = new CreateCarController();
carsRoutes.post(
    "/", 
    ensureAuthenticated, 
    ensureAdmin, 
    createCarController.handle
);

const createCarSpecificationController = new CreateCarSpecificationController();
carsRoutes.post(
    "/specifications/:id", 
    ensureAuthenticated, 
    ensureAdmin, 
    createCarSpecificationController.handle
);

const uploadCarsImagesController = new UploadCarsImagesController();
carsRoutes.post(
    "/images/:id", 
    ensureAuthenticated, 
    ensureAdmin,
    uploadCarImage.array("images"), 
    uploadCarsImagesController.handle
);

const listAvailableCarController = new ListAvailableCarController();
carsRoutes.get("/available", listAvailableCarController.handle);

export{ carsRoutes }