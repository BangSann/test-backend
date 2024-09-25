import express from "express";
// import Dongeng from "./Models/DongengModel.js";
import { countAllView, countDongeng, getDongeng , getDongengById, popularView, sumView } from "../controller/DongengController.js";
import { register, verify } from "../controller/AuthController.js";

const router = express.Router();

//dongeng
router.get("/api/dongeng/:id", getDongengById);
router.get("/api/dongeng", getDongeng);
router.get("/api/count/dongeng" , countDongeng)
router.get("/api/count/view" , countAllView)
router.get("/api/popular" , popularView)
router.get("/api/dongengview/:id" , sumView)
//dongeng - end

router.post("/api/register", register);
router.get("/api/verify", verify);

export default router;
