import express from "express";
// import Dongeng from "./Models/DongengModel.js";
import {
  countAllView,
  countDongeng,
  getDongeng,
  getDongengById,
  popularView,
  sumView,
} from "../controller/DongengController.js";
import {
  checkEmail,
  forgotPasswordForm,
  forgotPasswordSend,
  isAvailableEmail,
  isAvailableUsername,
  login,
  logout,
  refreshNewToken,
  register,
  validJWT,
  verify,
} from "../controller/AuthController.js";
import { getAllVisited, newVisited } from "../controller/visitedController.js";
import { getUserByID } from "../controller/UserController.js";
import accessValidation from "../middleware/authorization.js";
import { createSoalPilgan, createSoalUraianPanjang, createSoalUraianSingkat, deleteSoalPilgan, deleteSoalUraianPanjang, deleteSoalUraianSingkat, getSoalPilgan, getSoalUraianPanjang, getSoalUraianSingkat, updateSoalPilgan, updateSoalUraianPanjang, updateSoalUraianSingkat } from "../controller/soalController.js";

const router = express.Router();

// Soal
router.post("/api/set-soal-pilgan", accessValidation, createSoalPilgan);
router.get("/api/get-soal-pilgan", accessValidation, getSoalPilgan);
router.delete(
  "/api/delete-soal-pilgan/:id",
  accessValidation,
  deleteSoalPilgan
);
router.patch("/api/update-soal-pilgan/:id", accessValidation, updateSoalPilgan);

router.get(
  "/api/get-soal-uraian-singkat",
  accessValidation,
  getSoalUraianSingkat
);
router.post(
  "/api/set-soal-uraian-singkat",
  accessValidation,
  createSoalUraianSingkat
);
router.delete(
  "/api/delete-soal-uraian-singkat/:id",
  accessValidation,
  deleteSoalUraianSingkat
);
router.patch(
  "/api/update-soal-uraian-singkat/:id",
  accessValidation,
  updateSoalUraianSingkat
);

router.get(
  "/api/get-soal-uraian-panjang",
  accessValidation,
  getSoalUraianPanjang
);
router.post(
  "/api/set-soal-uraian-panjang",
  accessValidation,
  createSoalUraianPanjang
);
router.delete(
  "/api/delete-soal-uraian-panjang/:id",
  accessValidation,
  deleteSoalUraianPanjang
);
router.patch(
  "/api/update-soal-uraian-panjang/:id",
  accessValidation,
  updateSoalUraianPanjang
);
// Soal - end

// Users
router.get("/api/users/:id",accessValidation, getUserByID);
// users - end

// skripsi
router.get("/api/visited", newVisited);
router.get("/api/visited/get", getAllVisited);
// skripsi - end

//dongeng
router.get("/api/dongeng/:id", getDongengById);
router.get("/api/dongeng", getDongeng);
router.get("/api/count/dongeng", countDongeng);
router.get("/api/count/view", countAllView);
router.get("/api/popular", popularView);
router.get("/api/dongengview/:id", sumView);
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
