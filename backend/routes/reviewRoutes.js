import express from "express"
import {  createReviewController, getReviewsForProduct, reviewUserController } from "../controllers/reviewController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";



const router=express.Router();




router.post('/create-review',requireSignIn,createReviewController)
router.get('/:pid',getReviewsForProduct)
router.get('/review/:userId',requireSignIn,reviewUserController);
// router.get('/count/:pid',averageOfReviews)
export default router