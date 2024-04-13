import mongoose from "mongoose";

const adminOrderSchema = new mongoose.Schema({
    seller: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User" 
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product" 
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            default: "Not Process",
            enum: [
              "Not Process",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ],
          },
        quantity:
        {
            type:String,
            required:true
        },
        orderReceivedDate:
        {
            type: Date,
            default: Date.now
        }
    }],
},{timestamps:true});

export default mongoose.model('AdminOrder', adminOrderSchema);
