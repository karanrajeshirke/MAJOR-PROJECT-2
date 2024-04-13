import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminOrderModel from "../models/adminOrderModel.js";
import orderPageModel from "../models/orderPageModel.js";

dotenv.config();

//!BRAIN TREE

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const brainTreePaymentController = async (req, res) => {
  const { nonce } = req.body;

  try {
    let transactionResponse = await gateway.transaction.sale({
      amount: 1,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });


    res.status(200).send({ transactionResponse });
  } catch (error) {
    console.log(error);
  }
};

//!creating an product only admin access
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, inStock, shipping, category } =
      req.fields;
    const { photo } = req.files;

    if (!name) {
      return res.status(404).send({ message: "name is required" });
    }
    if (!description) {
      return res.status(404).send({ message: "description is required" });
    }
    if (!price) {
      return res.status(404).send({ message: "price is required" });
    }
    if (!inStock) {
      return res.status(404).send({ message: "inStock is required" });
    }
    if (!shipping) {
      return res.status(404).send({ message: "shipping is required" });
    }
    if (!category) {
      return res.status(404).send({ message: "category is required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(404)
        .send({ message: "photo is Required and should be less then 1mb" });
    } else {
      console.log("No photo ");
    }
    const products = new productModel({
      ...req.fields,
      slug: slugify(name),
      seller: req.user._id,
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while creating a product",
      error,
    });
  }
};

//! fetching products for home page (unproteced)
export const getProductsController = async (req, res) => {
  try {
    const allproducts = await productModel
      .find()
      .select("-photo")
      .populate("category")
      // .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      counTotal: allproducts.length,
      message: "ALlProducts ",
      allproducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while getting all products",
      error,
    });
  }
};

export const getProductsAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const allproducts = await productModel
      .find({ seller: adminId })
      .select("-photo")
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      counTotal: allproducts.length,
      message: "ALlProducts ",
      allproducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while getting all products",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    let { slug } = req.params;
    const product = await productModel
      .findOne({ slug })
      .select("-photo")
      .populate("seller").populate(
       {
        path:"reviews",
        populate:
        {
          path:"author"
        }
       }
      )
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

//!----------------------------------------------

//!----------------------------------------------
//! deleting a product
export const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await productModel
      .findByIdAndDelete(pid)
      .select("-photo");

    res.status(200).send({
      success: true,
      message: "Product deleted",
      deletedProduct,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while deleteing the product",
      error: error.message,
    });
  }
};

export const getProductPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;

    let product = await productModel.findById(pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching the photo",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const { name, description, price, inStock, shipping, category } =
      req.fields;
    const { photo } = req.files;

    if (!name) {
      return res.status(404).send({ message: "name is required" });
    }
    if (!description) {
      return res.status(404).send({ message: "description is required" });
    }
    if (!price) {
      return res.status(404).send({ message: "price is required" });
    }
    if (!inStock) {
      return res.status(404).send({ message: "inStock is required" });
    }
    if (!shipping) {
      return res.status(404).send({ message: "shipping is required" });
    }
    if (!category) {
      return res.status(404).send({ message: "category is required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(404)
        .send({ message: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating a product",
      error,
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { catFilter, radioFilter,ratingFilter } = req.body;
    let args = {};

    // productModel.find({category:[],price:{gte:radioFilter[0],lte:radioFilter[1]}})
    if (catFilter.length > 0) {
      args.category = catFilter;
    }
    if (radioFilter.length > 0) {
      args.price = { $gte: radioFilter[0], $lte: radioFilter[1] };
    }
    if (ratingFilter> 0) {
      args.averageRating={$gte:ratingFilter}
    }
    // console.log(args);
    let filteredData = await productModel.find(args).select("-photo");

    return res.status(200).send({
      success: "true",
      message: "data fetched successfully",
      filteredData,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating a product",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  let { query } = req.params;

  try {
    let searched_data = await productModel
      .find({ name: { $regex: query, $options: "i" } })
      .select("-photo");

    res.status(200).send({
      success: "true",
      message: "search successfull",
      searched_data,
    });
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Something went wrong while searching product",
      error,
    });
  }
};

export const getSimilarProductController = async (req, res) => {
  const { categoryId } = req.params;
  const { pid } = req.params;
  // console.log(categoryId);
  try {
    const simPro = await productModel
      .find({ category: categoryId, _id: { $ne: pid } })
      .select("-photo");

    // console.log(simPro);
    res.status(200).send({
      message: "fetched data",
      simPro,
    });
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Something went wrong while searching product",
      error,
    });
  }
};

//logged in user ..we will get the id of the product to be add to cart
export const AddToCart = async (req, res) => {
  try {
    let userId = req.user._id;
    let { pid } = req.params;

    const user = await userModel.findById(userId);
    const cartArray = user.cart; 

    const pidObjectId = new mongoose.Types.ObjectId(pid);

    const isThere = cartArray.includes(pidObjectId);

    if (isThere) {
      return res.status(500).send({
        message: "Already added to cart",
      });
    }

    let updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { cart: pid } },
      { new: true }
    );
    res.status(200).send({
      updatedUser,
      message: "Added to cart",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFromCart = async (req, res) => {
  try {
    let userId = req.user._id;

    const itemsFromCart = await userModel.findById(userId).populate({
      path: "cart",
      select: "-photo",
      populate: {
        path: "seller",
      },
    });

    res.status(200).send({
      products: itemsFromCart.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

//! remove item from cart

export const deleteCartItem = async (req, res) => {
  try {
    const id = req.user._id;
    const { pid } = req.params;

    const updatedCart = await userModel.findByIdAndUpdate(id, {
      $pull: { cart: pid },
    });

    res.status(200).send({
      message: "removed from cart",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCartSizeController = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await userModel.findById(id).populate({
      path: "cart",
      select: "-photo",
    });

    res.status(200).send(
      {
        length:user.cart.length
      }
    )
  } catch (error) {
    console.log(error);
  }
};

//! get bill temporary

export const getbill = async (req, res) => {
  try {
    let id = req.user._id;

    const data = await userModel.findById(id).populate({
      path: "orders",
      populate: {
        path: "product",
        select: "-photo",
        populate: {
          path: "seller",
          select: "name",
        },
      },
    });

    res.status(200).send({
      data: data.orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//!---------------------------------------------------------
//!place an order
export const placeOrder = async (req, res) => {
  try {
    const orderData = req.body.orderData;
    const orderDropDetails = req.body.orderDropDetails;
    const nonce = req.body.nonce;
    let userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!orderData.length) {
      return res.status(500).send({
        message: "Cart is empty cannot place order",
      });
    }

    const cartItems = await userModel.findById(userId).populate({
      path: "cart",
      select: "-photo",
    });

    let totalAmount = 0;
    for (let i = 0; i < orderData.length; i++) {
      totalAmount =
        totalAmount + orderData[i].quantity * cartItems.cart[i].price;
    }


    let transactionResponse = await gateway.transaction.sale(
      {
        amount: totalAmount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (err, result) {
        if (result) {
          const address = {
            country: orderDropDetails.country,
            houseadd: orderDropDetails.houseadd,
            city: orderDropDetails.city,
            state: orderDropDetails.state,
            postcode: orderDropDetails.postcode,
          };

          for (const order of orderData) {
            const newProduct = new orderPageModel({
              product: order.productId,
              quantity: order.quantity,
              country: orderDropDetails.country,
              houseadd: orderDropDetails.houseadd,
              city: orderDropDetails.city,
              state: orderDropDetails.state,
              postcode: orderDropDetails.postcode,
            });

            const savedProduct = await newProduct.save();
          }
   
          const formattedOrders = orderData.map((order) => ({
            product: order.productId,
            quantity: order.quantity,
            country: orderDropDetails.country,
            houseadd: orderDropDetails.houseadd,
            city: orderDropDetails.city,
            state: orderDropDetails.state,
            postcode: orderDropDetails.postcode,
          }));

          user.orders.push(formattedOrders);

          await user.save();

          for (const item of orderData) {
            let id = item.productId;
            await productModel.findByIdAndUpdate(id, {
              $inc: { inStock: -item.quantity },
            });
          }

          const products = cartItems.cart.map((item, index) => ({
            product: item._id,
            status: "Not Process",
            quantity: req.body.orderData[index].quantity,
          }));

          const buyerExists = await orderModel.findOne({ buyer: userId });
          if (buyerExists) {
            buyerExists.productArr.push(...products);
            await buyerExists.save();
          } else {
            const order = new orderModel({
              buyer: userId,
              productArr: products,
            });

            await order.save();
          }

          const productsBySeller = {};
          for (const item of orderData) {
            const productId = item.productId;

            const product = await productModel.findById(productId);
            const sellerId = product.seller;

            if (!productsBySeller[sellerId]) {
              productsBySeller[sellerId] = [];
            }
            productsBySeller[sellerId].push({
              product: productId,
              buyer: userId,
              status: "Not Process",
              quantity: item.quantity,
            });
          }

          for (const sellerId in productsBySeller) {
            let adminOrder = await adminOrderModel.findOne({
              seller: sellerId,
            });

            if (!adminOrder) {
              adminOrder = new adminOrderModel({
                seller: sellerId,
                products: productsBySeller[sellerId],
              });
            } else {
              adminOrder.products.push(...productsBySeller[sellerId]);
            }

            await adminOrder.save();

            const user = await userModel.findById(userId);
            user.cart = [];
            await user.save();
          }

          return res.status(200).send({
            message: "Order placed successfully",
          });
        } else {
          res.status(400).send({
            message: "Something went wrong in payment",
            err,
          });
        }
      }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

//! from user view
export const getPlacedOrders = async (req, res) => {
  try {
    let userId = req.user._id;
    const orders = await orderModel.findOne({ buyer: userId }).populate({
      path: "productArr.product",
      populate: [
        {
          path: "reviews",
          populate: {
            path: "author",
            select: "-password",
          },
        },
        {
          path: "seller",
          select: "-password",
        },
      ],
      
    });
    //!seller is inside the orders

    res.status(200).send(orders);
    // res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

//! ADMIN -ORDERS ROUTE

export const adminOrdersSide = async (req, res) => {
  try {
    const adminId = req.user._id;
    let adminOrders = await adminOrderModel
      .findOne({ seller: adminId })
      .populate({
        path: "products.product",
        select: "-photo",
      })
      .populate("products.buyer");

    if (adminOrders) {
      res.status(200).send({
        productsArr: adminOrders.products,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//!---------------------------------------------------------------

export const updateOrderStatus = async (req, res) => {
  try {
    let { pid, buyerId, status, id } = req.params;
    let sellerId = req.user._id;

    const buyer = await orderModel.findOne({ buyer: buyerId }).populate({
      path: "productArr.product",
      select: "-photo",
    });

    const seller = await adminOrderModel
      .findOne({ seller: sellerId })
      .populate({
        path: "products.product",
        select: "-photo",
      });

    seller.products.forEach((item) => {
      if (item.product._id.toString() === pid && item._id.toString() === id) {
        item.status = status;

      }
    });
    await seller.save();

    buyer.productArr.forEach((item) => {
      if (
        item.product._id.toString() === pid &&
        item.status === "Not Process"
      ) {
        item.status = status;
      }
    });

    const orderUpdated = await buyer.save();

    res.status(200).send({
      message: "Changed the status of the order successfully",
      orderUpdated,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

//! we will get a particular status data

export const getStatus = async (req, res) => {
  try {
    const id = req.user._id;
    const { status } = req.params;
   
    const data = await adminOrderModel
      .findOne({ seller: id })
      .populate({
        path: "products.product",
        select: "-photo",
      })
      .populate({
        path: "products.buyer",
        select: "name",
      });


    const filteredData = data.products.filter((item) => {
      return item.status === status;
    });

    
    res.send({ filteredData });
  } catch (error) {
    console.log(error);
  }
};

export const getStatusCount = async (req, res) => {
  try {
    const id = req.user._id;

    const Not_processed = await adminOrderModel.findOne({ seller: id });
    const Processing = await adminOrderModel.findOne({ seller: id });
    const Shipped = await adminOrderModel.findOne({ seller: id });
    const Delivered = await adminOrderModel.findOne({ seller: id });
    const Cancelled = await adminOrderModel.findOne({ seller: id });


    const l1 = Not_processed ? Not_processed.products.filter((item) => item.status === "Not Process") : [];
    const l2 = Processing ? Processing.products.filter((item) => item.status === "Processing") : [];
    const l3 = Shipped ? Shipped.products.filter((item) => item.status === "Shipped") : [];
    const l4 = Delivered ? Delivered.products.filter((item) => item.status === "Delivered") : [];
    const l5 = Cancelled ? Cancelled.products.filter((item) => item.status === "Cancelled") : [];

    const namesArr = ["Not_processed", "Processing", "Shipped", "Delivered", "Cancelled"];
    const valuesArr = [l1.length, l2.length, l3.length, l4.length, l5.length];

    res.status(200).send({
      namesArr,
      valuesArr,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getIndividualProductsCount = async (req, res) => {
  try {
    const id = req.user._id;

   
    const data = await adminOrderModel.findOne({ seller: id }).select("-photo").populate({
      path: "products.product",
      select: "-photo",
    });



    const productsByCount = {};
    if (data && data.products) {
      for (const item of data.products) {
        const key = item.product.name;

        const quantity = parseInt(item.quantity);

        if (!productsByCount[key]) {
          productsByCount[key] = quantity;
        } else {
          productsByCount[key] = productsByCount[key] + quantity;
        }
      }
    }

    const productNames = [];
    const productCount = [];

    for (const key in productsByCount) {
      productNames.push(key);
      productCount.push(productsByCount[key]);
    }
    res.status(200).send({
      productNames,
      productCount,
    });
  } catch (error) {
    console.log(error);
  }
};


export const adminProfileDetails = async (req, res) => {
  try {
    const id = req.user._id;

    const products = await productModel.find({ seller: id });

    const adminOrders = await adminOrderModel.findOne({ seller: id }).populate({
      path: "products.product",
      select: "-photo",
    });

    let amount = 0;
    if (adminOrders && adminOrders.products) {
      adminOrders.products.forEach((item) => {
        amount = amount + item.product.price * parseInt(item.quantity);
      });
    }

    res.status(200).send({
      productsCount: products.length,
      ordersCount: adminOrders ? adminOrders.products.length : 0,
      amount,
    });
  } catch (error) {
    console.log(error);
  }
};






export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};


export const getCategoriesSales=async(req,res)=>
{
  try {

    const userId = req.user._id;
const startDate = new Date(req.params.catDate); // Start date from req.params.catDate
const endDate = new Date(); // Current date

const allCategories = await categoryModel.find({});
const categoriesObject = {};

for (let i = 0; i < allCategories.length; i++) {
  categoriesObject[allCategories[i].name] = 0;
}

const admin = await adminOrderModel.findOne({ seller: userId }).populate({
  path: 'products',
  populate: {
    path: 'product',
    select: "category price",
    populate: {
      path: 'category'
    }
  }
});

const filteredProducts = admin.products.filter(product => {
  const orderReceivedDate = new Date(product.orderReceivedDate);
  const orderYear = orderReceivedDate.getFullYear();
  const orderMonth = orderReceivedDate.getMonth();
  const orderDay = orderReceivedDate.getDate();

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();
  const endDay = endDate.getDate();

  return orderYear >= startYear && orderYear <= endYear &&
         orderMonth >= startMonth && orderMonth <= endMonth &&
         orderDay >= startDay && orderDay <= endDay;
});

const pricesArr = [];
const catNamesArr = [];

if (!admin) {
  return res.send({ pricesArr, catNamesArr });
}

for (const product of filteredProducts) {
  const categoryName = product.product.category.name;
  const productPrice = product.product.price * parseInt(product.quantity);
  categoriesObject[categoryName] += productPrice;
}

for (const categoryName in categoriesObject) {
  catNamesArr.push(categoryName);
  pricesArr.push(categoriesObject[categoryName]);
}

res.send({ pricesArr, catNamesArr });


    // const userId=req.user._id;
    // const catDate=new Date(req.params.catDate);

    // console.log(catDate);
    // const todaysDate=new Date();

    // const allCategories=await categoryModel.find({});


    // const categoriesObject={};

    // for(let i=0;i<allCategories.length;i++)
    // {
    //   categoriesObject[allCategories[i].name]=0;
    // }

    // const admin=await adminOrderModel.findOne({seller:userId}).populate({
    //   path:'products',
    //   populate:
    //   {
    //     path:'product',
    //     select:"category",
    //     select:"price",
    //     populate:
    //     {
    //       path:'category'
    //     }
    //   }
    // });


    // const filteredProducts = admin.products.filter(product => {
    //   const orderReceivedDate = new Date(product.orderReceivedDate);
    //   const orderYear = orderReceivedDate.getFullYear();
    //   const orderMonth = orderReceivedDate.getMonth();
    //   const orderDay = orderReceivedDate.getDate();
    
    //   const targetYear = catDate.getFullYear();
    //   const targetMonth = catDate.getMonth();
    //   const targetDay = catDate.getDate();


    //   console.log(` order : ${orderYear}  .... ${orderMonth}....${orderDay}.....`);
    //   console.log(` target :${targetYear}  .... ${targetMonth}....${targetDay}.....`);
    //   console.log('-----------------');

    
    //   return orderYear === targetYear && orderMonth === targetMonth && orderDay === targetDay;
    // });

    // console.log(filteredProducts);


    // const pricesArr=[];
    // const catNamesArr=[];


    // if(!admin)
    // {
    //    return res.send({pricesArr,catNamesArr})
    // }


    // const {products}=admin

    // for(let i=0;i<products.length;i++)
    // {

    //   categoriesObject[products[i].product.category.name]=categoriesObject[products[i].product.category.name]+(products[i].product.price*parseInt(products[i].quantity))
    // }

 

    // for(const categoryName in categoriesObject)
    // {
    //   catNamesArr.push(categoryName);
    //   pricesArr.push(categoriesObject[categoryName])
    // }
    // res.send({pricesArr,catNamesArr})

    
    
  } catch (error) {

    console.log(error);
    
  }
}