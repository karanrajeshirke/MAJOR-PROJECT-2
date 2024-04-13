import mongoose from "mongoose";

const orderPageSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: { type: Number, required: true },

        country:
        {
          type:String,
          // required: true
        },
        houseadd:
        {
          type:String,
          // required: true
        },
        city:
        {
          type:String,
          // required: true
        },
        state:
        {
          type:String,
          // required: true
        },
        postcode:
        {
          type:String,
          // required: true
        }
      ,
      date: { type: Date, default: Date.now }
});

export default mongoose.model('orderPage',orderPageSchema)