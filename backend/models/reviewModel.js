import mongoose from "mongoose";


const reviewSchema=new mongoose.Schema(
    {
        rating:
        {
            type:Number,
            required:true,
            min:0
        },
        comment:
        {
            type:String,
            required:true,
        },
        author:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    }
)


export default mongoose.model('Review',reviewSchema)