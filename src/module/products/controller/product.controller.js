import userModel from '../../../../DB/model/user.model.js'
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';
import cloudinary from '../../../services/cloudinary.js'
import productModel from '../../../../DB/model/products.model.js';
const getProductsPop = [

  {
    path: "comments",
    populate: [
      { path: "userId" },
      {
        path: "replies",
        populate: [
          { path: "userId" },
        ]
      },
    ],

  },


];

export const add = asyncHandler(async (req, res, next) => {


  let imagesURL = [];
  let imageIds = [];

  if (req.files) {


    for (const file of req.files) {


      await cloudinary.uploader.upload(file.path, (error, result) => {
        

        if (error) {
          console.error(error);
        } else {

          imagesURL.push(result.secure_url)
          imageIds.push(result.public_id);
        }
      }


      );
    }


  }

  let { name, description } = req.body
  let addProduct = await create({ model: productModel, data: { images: imagesURL, publicImagesIds: imageIds, name, description } })
  if (!addProduct) {
    for (const id of publicImagesIds) {
      await cloudinary.uploader.destroy(id)
    }
    res.status(400).json({ message: "error when insert to DB" })

  } else {
    return res.status(201).json({ message: "Created", addProduct })
  }
})
export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await find({ model: productModel, populate: [...getProductsPop] })
  if (products) {
    res.status(200).json({ products })
  } else {
    res.status(404).json({ message: "no products" })

  }

})
export const update = asyncHandler(async (req, res, next) => {
  let { deleteUrl, deleteId, productId, name, description } = req.body
  let product = await findById({ model: productModel, condition: productId })
  let images = product.images;
  let publicImagesIds = product.publicImagesIds
  if (deleteUrl) {
    deleteUrl = deleteUrl.split(',')
    for (let i = 0; i < deleteUrl.length; i++) {
      const element = deleteUrl[i];
      images = images.filter(item => item != element)
    }
  }
  if (deleteId) {
    deleteId = deleteId.split(',')
    for (let i = 0; i < deleteId.length; i++) {
      const element = deleteId[i];
      await cloudinary.uploader.destroy(element)
      publicImagesIds = publicImagesIds.filter(item => item != element)
    }
  }
  if (req.files) {
    for (const file of req.files) {
      await cloudinary.uploader.upload(file.path, (error, result) => {
        if (error) {
          console.error(error);
        } else {
          images.push(result.secure_url)
          publicImagesIds.push(result.public_id);
        }
      });
    }
  }
  let updatedProduct = await findByIdAndUpdate({ model: productModel, condition: productId, data: { images, publicImagesIds, name, description }, options: { new: true } })
  if (updatedProduct) {
    return res.status(201).json({ message: "updated", updatedProduct })
  }
})
export const deleteProduct = asyncHandler(async (req, res, next) => {
  let { id } = req.params
  let product = await findByIdAndDelete({ model: productModel, condition: id })
  if (product) {
    return res.status(201).json({ message: "deleted" })
  }
})
export const hideProd = asyncHandler(async (req, res, next) => {
  let { id } = req.body
  let product = await findById({ model: productModel, condition: id })
  let hideProduct = await findByIdAndUpdate({ model: productModel, condition: id, data: { hide: !product.hide }, options: { new: true } })
  if (hideProduct) {
    return res.status(201).json({ message: "hide" })
  }
})
export const like = asyncHandler(async (req, res, next) => {

  let { productId, userId } = req.body
  let Product = await findById({ model: productModel, condition: productId })
  let user = await findById({ model: userModel, condition: userId })

  let updateProduct = await findByIdAndUpdate({
    model: productModel, condition: productId, data: {
      $addToSet: { likes: userId },
    }, options: { new: true }
  })

  if (Product.likes.length != updateProduct.likes.length) {
    let updateUser = await findByIdAndUpdate({
      model: userModel, condition: userId, data: {
        $addToSet: { likes: productId },
      }, options: { new: true }
    })
    return res.status(201).json({ message: "like" })

  } else {
    let productLikes = Product.likes.filter(item => item != userId)
    let userLikes = user.likes.filter(item => item != productId)
    let updateProduct = await findByIdAndUpdate({
      model: productModel, condition: productId, data: {
        likes: productLikes
      }, options: { new: true }
    })

    let updateUser = await findByIdAndUpdate({
      model: userModel, condition: userId, data: {
        likes: userLikes
      }, options: { new: true }
    })
    return res.status(201).json({ message: "unLike" })

  }
})
export const getProduct = asyncHandler(async (req, res, next) => {
  let { id } = req.params
  let product = await findById({ model: productModel, condition: id, populate: [...getProductsPop] })
  res.status(201).json({ product })

})
