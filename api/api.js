import express from "express";
// import Dongeng from "./Models/DongengModel.js";
import { countAllView, countDongeng, getDongeng , getDongengById, popularView, sumView } from "../controller/DongengController.js";
import { checkEmail, forgotPasswordForm, forgotPasswordSend, isAvailableEmail, isAvailableUsername, login, logout, refreshNewToken, register, validJWT, verify } from "../controller/AuthController.js";
import { getAllVisited, newVisited } from "../controller/visitedController.js";
import { getUserByID } from "../controller/UserController.js";

const router = express.Router();

// Users
router.get("/api/users/:id", getUserByID);
// users - end

// skripsi
router.get("/api/visited" , newVisited)
router.get("/api/visited/get" , getAllVisited)
// skripsi - end

//dongeng
router.get("/api/dongeng/:id", getDongengById);
router.get("/api/dongeng", getDongeng);
router.get("/api/count/dongeng" , countDongeng)
router.get("/api/count/view" , countAllView)
router.get("/api/popular" , popularView)
router.get("/api/dongengview/:id" , sumView)
//dongeng - end

//auth
router.post("/api/register", register);
router.get("/api/verify", verify);
router.post("/api/login", login);
router.post("/api/logout", logout);

router.get("/api/auth/alreadyexist/email", isAvailableEmail);
router.get("/api/auth/alreadyexist/username", isAvailableUsername);
router.get("/api/auth/email", checkEmail);
router.post("/api/forgot-password", forgotPasswordSend);
router.post("/api/forgot-password/:token", forgotPasswordForm);
router.post("/api/refresh-token", refreshNewToken);
router.get("/api/isvalidtoken/:token", validJWT);

//auth - end

export default router;
