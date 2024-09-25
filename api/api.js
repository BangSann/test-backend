import express from "express";
// import Dongeng from "./Models/DongengModel.js";
import { getDongeng , getDongengById } from "../controller/DongengController.js";
import { register } from "../controller/AuthController.js";

const router = express.Router();

router.get("/api/dongeng/:id", getDongengById);
router.post("/api/register", register);
router.get("/api/dongeng", getDongeng);

export default router;
