import userModel from '../../../../DB/model/user.model.js'
import { sendEmail } from '../../../services/email.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';
import { paginate } from '../../../services/pagination.js';
import cloudinary from '../../../services/cloudinary.js'
import productModel from '../../../../DB/model/products.model.js';

export const addComment = asyncHandler(async (req, res, next) => {

  let { comment, userId, productId } = req.body
  let product = await findById({ model: productModel, condition: productId })
  if (product) {
    product.comments.push({ comment, userId })
    let addComment = await findByIdAndUpdate({ model: productModel, condition: productId, data: { comments: product.comments }, options: { new: true } })
    if (addComment) {
      res.status(201).json({ message: 'Added comment' })
    }
  }

})
export const deleteComment = asyncHandler(async (req, res, next) => {
  let { commentId, productId } = req.body

  let product = await findById({ model: productModel, condition: productId })
  if (product) {
    product.comments = product.comments.filter(item => item._id != commentId)
    let deleteComment = await findByIdAndUpdate({ model: productModel, condition: productId, data: { comments: product.comments }, options: { new: true } })
    if (deleteComment) {
      res.status(201).json({ message: 'Deleted comment' })
    }
  }

})
export const hideComment = asyncHandler(async (req, res, next) => {
  let { commentId, productId } = req.body

  let product = await findById({ model: productModel, condition: productId })
  if (product) {
    for (let i = 0; i < product.comments.length; i++) {
      const element = product.comments[i];
      if (element._id == commentId) {
        element.hide = !element.hide
      }
    }
    let deleteComment = await findByIdAndUpdate({ model: productModel, condition: productId, data: { comments: product.comments }, options: { new: true } })
    if (deleteComment) {
      res.status(201).json({ message: 'Hide comment' })
    }
  }
})
export const addReply = asyncHandler(async (req, res, next) => {
  let { reply, userId, productId, commentId } = req.body
  let product = await findById({ model: productModel, condition: productId })
  if (product) {
    for (let i = 0; i < product.comments.length; i++) {
      const element = product.comments[i];
      if (element._id == commentId) {
        element.replies.push({ reply, userId })
      }
    }

    let addReply = await findByIdAndUpdate({ model: productModel, condition: productId, data: { comments: product.comments }, options: { new: true } })
    if (addReply) {
      res.status(201).json({ message: 'Added reply' })
    }
  }

})
export const deleteReply = asyncHandler(async (req, res, next) => {

})
