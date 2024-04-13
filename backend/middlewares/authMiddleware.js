import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export const requireSignIn = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }

  try {
    //! decode is going to contain the payload that we provided while register
    //!this decode is going to be useful in our protected routes where we will be needing to do something with the
    //!user.for example for admin 
    //! for to be admin the person must have role 1
    //! now how can we know that he has a role 1
    //!by checking through its db 
    //! for that we need its id
    //! we will be having its id in req.user._id becoz he is logged in we are having it 

    //! so in short this decode is used for the backend only 
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Invalid token Babu' });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    //! since the user is logged in we will have user_id in req object
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access You are not an admin",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};


//! we have to check if a admin wants to delete or update product he must be the creator of that product
//! since we are dealing with admin ..2 things are already verfiied first he is logged in & second he is a admin
//! therefore we dont need to check those 2 condiitons
export const isAuthorizedAdmin=async(req,res,next)=>
{
    try
    {

      const currentLoggedInAdmin=req.user._id;
      const {pid}=req.params
      const product=await productModel.findById(pid)
      const productOwner=product.seller

      if(currentLoggedInAdmin!=productOwner)
      {
        return res.status(500).send(
          {
            message:"You are not the owner of the product gaap ghari ja ata shembdya"
          }
        )
      }

      next()

    }
    catch(error)
    {
      console.log(error);
      
    }

   
}