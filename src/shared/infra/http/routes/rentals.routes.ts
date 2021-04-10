import { Router } from "express";
import { CreateRentalController } from "@modules/rentals/useCases/createRental/CreateRentalController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CarReturnController } from "@modules/rentals/useCases/CarReturn/CarReturnController";
import { ListRentalsByUserController } from "@modules/rentals/useCases/ListRentalsByUser/ListRentalsByUserController";

const rentalsRoutes = Router();

const createRentalController = new CreateRentalController();
rentalsRoutes.post("/", ensureAuthenticated, createRentalController.handle);

const carReturnController = new CarReturnController();
rentalsRoutes.post("/car-return/:id", ensureAuthenticated, carReturnController.handle);

const listRentalsByUserController = new ListRentalsByUserController();
rentalsRoutes.get("/user", ensureAuthenticated, listRentalsByUserController.handle);

export{rentalsRoutes};