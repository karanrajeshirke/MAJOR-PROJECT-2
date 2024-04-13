import {createProductController,getProductsController,getSingleProductController,deleteProductController,getProductPhotoController,updateProductController,
productFiltersController,
searchProductController,
getSimilarProductController,
brainTreeTokenController,
brainTreePaymentController,
AddToCart,
getFromCart,
placeOrder,
getPlacedOrders,
adminOrdersSide,
getProductsAdmin,
updateOrderStatus,
getStatus,
getStatusCount,
getIndividualProductsCount,
adminProfileDetails,
getbill,
deleteCartItem,
getCartSizeController,
getCategoriesSales,
} from "../controllers/productController.js";
import { isAdmin, isAuthorizedAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import productModel from "../models/productModel.js";
import express from "express";
import formidable from "express-formidable";

const router = express.Router();

router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController);
router.get("/get-products", getProductsController);
router.get('/get-products/:adminId',requireSignIn,isAdmin,getProductsAdmin)
router.get("/get-single-product/:slug", getSingleProductController);
router.get("/get-product-photo/:pid", getProductPhotoController);
router.delete("/delete-product/:pid",requireSignIn,isAdmin,isAuthorizedAdmin, deleteProductController);
router.put("/update-product/:pid",requireSignIn,isAdmin,isAuthorizedAdmin,formidable(),updateProductController);
router.post('/product-filters',productFiltersController)
router.get('/search-product/:query',searchProductController)
router.get('/get-similar-products/:pid/:categoryId',getSimilarProductController)
router.get('/add-to-cart/:pid',requireSignIn,AddToCart)
//! get items from cart
router.get('/cart',requireSignIn,getFromCart)


router.get('/cartsize',requireSignIn,getCartSizeController)

router.delete('/deleteCart/:pid',requireSignIn,deleteCartItem)

//!place order we are changing get request to post
router.post('/place-order',requireSignIn,placeOrder)

//!get placed order

router.get('/all-orders',requireSignIn,getPlacedOrders)

//! bill of orders

router.get('/bill',requireSignIn,getbill)

//!admin orders

router.get('/admin-orders',requireSignIn,isAdmin,adminOrdersSide)

//!update order

router.put('/update-order-status/:pid/:buyerId/:status/:id',requireSignIn,isAdmin,isAuthorizedAdmin,updateOrderStatus)

//! count of products
router.get('/individualProductCount',requireSignIn,isAdmin,getIndividualProductsCount)



//! get the count of status
router.get('/getcount',requireSignIn,isAdmin,getStatusCount)

router.get('/admin-profile-details',requireSignIn,isAdmin,adminProfileDetails)

//! filtered status
router.get('/:status',requireSignIn,isAdmin,getStatus)


//! payment 
router.get('/braintree/token',brainTreeTokenController)
router.post('/braintree/payment',requireSignIn,brainTreePaymentController)


router.get('/individual/category-sales/:catDate',requireSignIn,isAdmin,getCategoriesSales);


export default router;
