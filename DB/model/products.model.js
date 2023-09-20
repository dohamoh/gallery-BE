import { Schema, model, Types } from "mongoose";

let replySchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User"
  },
  reply: {
    type: String,
    required: true
  },
  hide: {
    type: Boolean,
    default: false
  },
})
let commentsSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User"
  },
  comment: {
    type: String,
    required: true
  },
  hide: {
    type: Boolean,
    default: false
  },
  replies: [replySchema]

})
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    min: [2, 'minimum length 2 char'],
    max: [20, 'max length 20 char']
  },
  description: {
    type: String,
    required: [true, 'description is required'],
    min: [2, 'minimum length 2 char'],
    max: [500, 'max length 500 char']
  },

  hide: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    required: [true, 'product images is required'],
  },
  publicImagesIds: [String],
  likes: [{
    type: Types.ObjectId,
    ref: "User"
  }],
  comments: [commentsSchema]
}, {
  timestamps: true
})

const productModel = model('product', productSchema);
export default productModel
