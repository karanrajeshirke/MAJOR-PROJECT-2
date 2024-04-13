import express from "express"
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { createCategoryController,updateCategoryController,getAllCategoryController,getSingleCategory, deleteCategory } from "../controllers/categoryControllers.js"
const router=express.Router()

router.post('/create-category',requireSignIn,isAdmin,createCategoryController)
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)
router.get('/get-allcategory',getAllCategoryController)
router.get('/get-singlecategory/:slug',getSingleCategory)
router.delete('/delete-category/:id',deleteCategory)


export default router