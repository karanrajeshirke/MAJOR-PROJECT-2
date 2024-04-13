import express from "express";
import {
  loginController,
  registerController,
  testController,
  adminController,
  getUserPhotoController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import userModel from "../models/userModel.js";
import formidable from "express-formidable";

const router = express.Router();

router.post("/register", formidable(),registerController);
router.post("/login", loginController);
router.get("/test", requireSignIn, testController);
router.get("/adminRoute", requireSignIn, isAdmin, adminController);



router.get('/getphoto/:userId',getUserPhotoController)


//! USER ROUTE

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//!ADMIN ROUTE
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
