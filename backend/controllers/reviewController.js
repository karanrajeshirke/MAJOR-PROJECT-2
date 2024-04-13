import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";
import mongoose from "mongoose";
export const createReviewController = async (req, res) => {
  try {
    const id = req.user._id;
    const { pid, rating, comment } = req.body;

    const product = await productModel.findById(pid).populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "-photo",
      },
    });
    // const isPresent = product.reviews.find((item) => {
    //   return item.author._id.equals(id);
    // });
    // if (isPresent) {
    //   return res.status(400).send({
    //     message: "Already marked review",
    //   });
    // }

    const review = new reviewModel({
      rating,
      comment,
      author: id,
    });

    const data = await review.save();

    product.reviews.push(review);

    await product.save();

    let sum = 0;
    let average = 0;
    for (const review of product.reviews) {
      sum = sum + review.rating;
    }
    average = sum / product.reviews.length;

    const updated = await productModel.findByIdAndUpdate(
      pid,
      {
        $inc: { totalReviews: 1 },
        averageRating: parseFloat(average.toFixed(1)),
      },
      { new: true }
    );

    res.status(200).send({
      message: "review created",
      updated,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getReviewsForProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    console.log(pid);

    const product = await productModel
      .findById(pid)
      .populate({
        path: "reviews",

        populate: {
          path: "author",
          select: "-photo",
        },
      })
      .select("-photo");

    const reviews = product.reviews;

    res.send({ reviews });
  } catch (error) {
    console.log(error);
  }
};

export const reviewUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const allProducts = await productModel.find({}).populate("reviews");

    const data = allProducts.map((product) => {
      const { reviews } = product;

      const userReview = reviews.find((singleReview) => {
        return singleReview.author.equals(userId);
      });

      if (userReview) {
        return {
          productName: product.name,
          productId:product._id,
          photo: product.photo,
          review: userReview,
        };
      }
    });

    const allUserReviews = data.filter((item) => {
      return item!=null
    });
    res.send({ allUserReviews });
  } catch (error) {
    console.log(error);
  }
};
