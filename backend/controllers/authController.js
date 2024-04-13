import { hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
import fs from "fs";


function checkPassword(password)
{
  let len=password.length;

  if(len<8)
  {
    return false;
  }

  let hasUpper=false;
  let hasLower=false;
  let hasNumber=false;
  let hasSpecial=false;

  const specialChars = "!@#$%^&*()\-_=+{};:,<.>?";
  for(let i=0;i<len;i++)
  {
      if(password[i]>='a' && password[i]<='z')
      {
        hasLower=true;
      }
      else if(password[i]>='A' && password[i]<='Z')
      {
        hasUpper=true;
      }
      else if(password[i]>='0' && password[i]<='9')
      {
        hasNumber=true;
      }
      else if(specialChars.includes(password[i]))
      {
        hasSpecial=true;
      }
  }

  return hasLower && hasUpper && hasNumber && hasSpecial
}

export const registerController = async (req, res) => {
  try {
    let { name, email, password, phone, address, role } = req.fields;
    let { photo } = req.files;


    if (!name) {
      return res.status(401).send({ message: "name is required" });
    }
    if (!email) {
      return res.status(401).send({ message: "email is required" });
    }
    if (!password) {
      return res.status(401).send({ message: "password is required" });
    }

    if(!checkPassword(password))
    {
      return res.status(401).send({ message: "password not meet required conditions" });
    }

    if (!phone) {
      return res.status(401).send({ message: "phone is required" });
    }
    if (!address) {
      return res.status(401).send({ message: "address is required" });
    }

    if (photo) {
      photo.data = fs.readFileSync(photo.path);
      photo.contentType = photo.type;
    }
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        success: "false",
        message: "Already Register please login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      role,
      photo,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: "true",
      message: "Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errror in Registeration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).send({
        success: "false",
        message: "Enter Email & Password",
      });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: "false",
        message: "Email is not registered",
      });
    }
    let comparePassword = await bcryptjs.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).send({
        success: "false",
        message: "Invalid Password",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Logged In Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });

    //! we are sending the user after logged in bcoz this is going to be used when we are in frontend ..we would not needing the detials
    //!of the user who is logged in ..... and the payload would be useful in backend
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errror in Login",
      error,
    });
  }
};

export const getUserPhotoController = async (req, res) => {
  try
  {
    const {userId}=req.params;

    const user=await userModel.findById(userId).select("photo")

    res.set('Content-type',user.photo.contentType);
    res.status(200).send(user.photo.data)
  }
  catch(error)
  {
    console.log(error);
  }
};




export const testController = async (req, res) => {
  res.send({ message: "test route" });
};

export const adminController = (req, res) => {
  res.send("You are an admin");
};
