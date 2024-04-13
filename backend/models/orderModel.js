import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productArr: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
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
          type:Number,
          required:true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
      },
    ],
  }
);

export default mongoose.model("Order", orderSchema);

// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//     buyer: {
//        type: mongoose.Schema.Types.ObjectId,
//        ref: "User"
//     },
//     productArr: [{
//         product: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Product"
//         },
//         seller: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         },status: {
//             type: String,
//             default: "Not Process",
//             enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"]
//         }
//     }]
// });

// export default mongoose.model('Order',orderSchema)
