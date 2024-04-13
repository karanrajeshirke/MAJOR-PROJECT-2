import mongoose from "mongoose";



const productSchema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        slug:
        {
            type:String
        },
        description:
        {
            type:String,
            required:true
        },
        category:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true
        },
        price:
        {
            type:Number,
            required:true,
            min:1
        },
        inStock:
        {
            type:Number,
            required:true,
            min:0
        },
        photo:
        {
            data: Buffer,
            contentType: String,
        },
        shipping:
        {
            type:Boolean
        },
        averageRating:
        {
            type:Number,
            default:0,
            min:0
        },
        totalReviews:
        {
            type:Number,
            default:0,
            min:0
        },
        seller:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        reviews:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Review'
            }
        ]
    },{timestamps:true}
)

export default mongoose.model('Product',productSchema)