import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async(req, res) => {
  try {
    const { name } = req.body;
    console.log(name)
    if (!name) {
        return res.status(401).send({ message: "Name is required" });
    }

    const existingCategory=await categoryModel.findOne({name})

    if(existingCategory)
    {
        return res.status(409).send(
            {
                success:false,
                message:"Category already exist"
            }
        )
    }

    console.log(existingCategory)
    const savedCategory=await new categoryModel( {name,slug:slugify(name)}).save()

    console.log(savedCategory)
    res.status(200).send({
        success:true,
        message:"Category Created",
        savedCategory
    })


  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in Creating a cateogyy",
      error,
    });
  }
};


export const updateCategoryController=async(req,res)=>
{
    try{

        let {id}=req.params
        let {name}=req.body

        const existingCategory=await categoryModel.findOne({slug:name})
        
        if(existingCategory)
        {
            return res.status(400).send(            
                    {
                        success:false,
                        message:"Category Already exists"
                    }
                
            )
        }
        const category=await categoryModel.findById(id)


        if(!category)
        {
            return res.status(401).send(
                {
                    success:false,
                    message:"Category to be updated not found"
                }
            )
        }


       const updatedCategory=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})

        return res.status(200).send(
            {
                success:true,
                message:"Updated category",
                updatedCategory
            }
        )

    }
    catch(error)
    {
        return res.status(500).send(
            {
                success:false,
                message:"Error in updating category",
                error
            }
        )
    }
}

export const getAllCategoryController=async(req,res)=>
{
    try
    {
        const allCategory=await categoryModel.find()

        return res.status(200).send(
            {
                success:true,
                message:"All Categories",
                allCategory
            }
        )
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send(
            {
                success:false,
                message:"Error while getting the category",
                error
            }
        )
    }
}

export const getSingleCategory=async(req,res)=>
{
    try
    {
        const {slug}=req.params
        const category=await categoryModel.findOne({slug:slug})

        return res.status(200).send(
            {
                success:true,
                message:"Single Category",
                category
            }
        )

    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send(
            {
                success:false,
                message:"Error while getting single category",
                error
            }
        )
    }
}

export const deleteCategory=async(req,res)=>
{
    try
    {
        const {id}=req.params

        const deletedCategory=await categoryModel.findByIdAndDelete(id)

        if(!deletedCategory)
        {
            return res.status(404).send(
                {
                    success:false,
                    message:"Category to be deleted not found",

                }
            )
        }


        return res.status(200).send(
            {
                success:true,
                message:"Category deleted",
                deletedCategory
            }
        )
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send(
            {
                success:false,
                message:"error while deleteing category",
                error
            }
        )
    }
}

//! note if id is 12345 
//! if you change any letter to someone other and that does not eixist then you will get null when you try to find
//! but if you change the length then you will get an error
