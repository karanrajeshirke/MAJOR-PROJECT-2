import express from 'express'
import dotenv from 'dotenv'
import connectDB from './confg/db.js'
import morgan from 'morgan'
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import cors from 'cors'
import formidable from 'express-formidable'
import productModel from './models/productModel.js'
import userModel from './models/userModel.js'
import categoryModel from './models/categoryModel.js'
import orderModel from './models/orderModel.js'
import adminOrderModel from './models/adminOrderModel.js'
import orderPageModel from './models/orderPageModel.js'
import reviewModel from './models/reviewModel.js'
const app=express()

//!to access env files
dotenv.config()

//! calling database
connectDB()

//!middleware
app.use(cors())
app.use(express.json())
// app.use(morgan('dev'))


app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/review",reviewRoutes)



app.get('/find',async(req,res)=>
{
    try {
        //    const data= await productModel.find({averageRating:{gte:1}});
            const {rating}=req.body;
            console.log(rating);
           const data = await productModel.find({ averageRating: { $gte: 1 } }).select("-photo");

           res.send(data);
    } catch (error) {
        console.log(error);
    }
})

app.delete('/delete',async(req,res)=>
{
   let data=await productModel.deleteMany({})
   await userModel.deleteMany({})
   await categoryModel.deleteMany({})
   await orderModel.deleteMany({})
  await adminOrderModel.deleteMany({});
  await orderPageModel.deleteMany({})
  await reviewModel.deleteMany({});
  res.send({message:"delete"})

    // const user=await userModel.findById("65ceea8763da7b0837ea0b87");
      // user.cart=[]
      // await user.save()
      res.send({message:"delete"})
})



const PORT=process.env.PORT_NO || 8080

app.listen(PORT,()=>
{
    console.log(`Server running on port : ${PORT} & mode is ${process.env.DEV_MODE}`)
})


//dont change code

