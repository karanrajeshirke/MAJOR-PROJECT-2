import mongoose from "mongoose";
import orderPageModel from "./orderPageModel.js";



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  photo:
  {
    data:Buffer,
    contentType: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8, 
  },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
    enum: [0, 1]
},
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [[orderPageModel.schema]],
});

export default mongoose.model("User", userSchema);
