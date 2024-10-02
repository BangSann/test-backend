import express from "express";
// import Dongeng from "./Models/DongengModel.js";
import {
  countAllView,
  countDongeng,
  createDongeng,
  deleteDongeng,
  getDongeng,
  getDongengById,
  popularView,
  sumView,
  updateDongeng,
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
  updateProfile,
} from "../controller/AuthController.js";
import { getAllVisited, newVisited } from "../controller/visitedController.js";
import {
  getUserByID,
  profile,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/UserController.js";
import accessValidation from "../middleware/authorization.js";
import {
  createSoalPilgan,
  createSoalUraianPanjang,
  createSoalUraianSingkat,
  deleteSoalPilgan,
  deleteSoalUraianPanjang,
  deleteSoalUraianSingkat,
  getSoalPilgan,
  getSoalUraianPanjang,
  getSoalUraianSingkat,
  updateSoalPilgan,
  updateSoalUraianPanjang,
  updateSoalUraianSingkat,
} from "../controller/soalController.js";
import {
  createQuiz,
  deleteQuiz,
  getAllQuiz,
  getQuizById,
  updateQuiz,
} from "../controller/quizController.js";
import {
  getQuizByUserId,
  getRekapByForumId,
  joinForumByToken,
  updateNilaiQuiz,
} from "../controller/forumController.js";

const router = express.Router();

// Forum Quiz
router.get("/api/get-all-quiz", getAllQuiz);
router.post("/api/create-quiz", accessValidation, createQuiz);
router.delete("/api/delete-quiz/:id", accessValidation, deleteQuiz);
router.patch("/api/update-quiz/:id", accessValidation, updateQuiz);
router.get("/api/get-quiz/:id", accessValidation, getQuizById);
// Forum Quiz - End

// Quiz
router.get("/api/get-rekap/:id_forum", getRekapByForumId);
router.post("/api/join-forum", accessValidation, joinForumByToken);
router.get(
  "/api/get-forum-by-userid/:id_user",
  accessValidation,
  getQuizByUserId
);
router.post("/api/update-nilai-quiz", accessValidation, updateNilaiQuiz);
// Quiz - End

// Soal
router.get("/api/get-soal-pilgan", getSoalPilgan);
router.post("/api/set-soal-pilgan", accessValidation, createSoalPilgan);
router.delete(
  "/api/delete-soal-pilgan/:id",
  accessValidation,
  deleteSoalPilgan
);
router.patch("/api/update-soal-pilgan/:id", accessValidation, updateSoalPilgan);

router.get("/api/get-soal-uraian-singkat", getSoalUraianSingkat);
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

router.get("/api/get-soal-uraian-panjang", getSoalUraianPanjang);
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
router.get("/api/users/:id", accessValidation, getUserByID);
router.get("/api/profile/:token", profile);
router.post("/api/profile/update/:id", accessValidation, updateProfile);
router.get("/api/users", accessValidation, getUser);
router.post("/api/users", createUser);
router.patch("/api/users/:id", updateUser);
router.delete("/api/users/:id", accessValidation, deleteUser);
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
router.post("/api/dongeng", createDongeng);
router.delete("/api/dongeng/:id", deleteDongeng);
router.patch("/api/dongeng/:id", updateDongeng);
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
