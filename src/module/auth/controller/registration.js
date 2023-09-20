import userModel from '../../../../DB/model/user.model.js'
import { sendEmail } from '../../../services/email.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../../../services/asyncHandler.js';
import { findById, findByIdAndDelete, findOneAndUpdate, findOne, find, findByIdAndUpdate, create, findOneAndDelete } from '../../../../DB/DBMethods.js';
import { paginate } from '../../../services/pagination.js';
import cloudinary from '../../../services/cloudinary.js'


export const signUp = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;
    const user = await findOne({ model: userModel, condition: { email }, select: "email" })
    if (user) {
        res.status(409).json({message:"this email already register"})

    } else {
        let addUser = new userModel({ userName, email, password});
            let savedUser = await addUser.save()
            res.status(201).json({ message: "added successfully", savedUser })
    }

})
export const confirmEmail = asyncHandler(async (req, res, next) => {
    let { token } = req.params
    let decoded = jwt.verify(token, process.env.emailToken)
    if (!decoded && !decoded.id) {
        res.status(400).json({message:"invalid token data"})

    } else {
        const updatedUser = await findByIdAndUpdate({ model: userModel, condition: decoded.id , data: { confirmEmail: true }, options: { new: true } })

        if (updatedUser) {
          if (updatedUser.confirmEmail) {
            res.redirect("https://agalleria.co/register")
          }else{
            res.redirect("https://agalleria.co/refreshToken")
          }
        } else {
          res.redirect("https://agalleria.co/refreshToken")
        }
    }

})
export const resendConfirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params


    let decoded = jwt.verify(token, process.env.emailToken)

    if (!token) {
        res.status(400).json({message:"invalid token data"})

    } else {
        const user = await findById({ model: userModel, condition:  decoded.id })

if (user.confirmEmail) {
 return res.redirect("https://agalleria.co/register")
}
        let token = jwt.sign({ id: decoded.id, isLoggedIn: true }, process.env.emailToken, { expiresIn: '1h' })
        let refreshToken = jwt.sign({ id: decoded._id, isLoggedIn: true }, process.env.emailToken, { expiresIn: 60 * 60 * 24 })

        let link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
        let refreshLink = `${req.protocol}://${req.headers.host}/auth/refreshToken/${refreshToken}`

        let message = `please verify your email <a href="${link}" > here </a>
                        <br/>
                        to resend please click <a href="${refreshLink}" > here </a>
                        `
        let emailRes = await sendEmail(user.email, "confirm to register", message);
        if (emailRes.accepted.length) {
          return res.redirect("https://agalleria.co/register")
      }
       res.redirect("https://agalleria.co/register")
    }
})
export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await findOne({ model: userModel, condition: { email } })
    if (!user) {
        res.status(404).json({message:"You have to register first"})

    } else {
        let compare = bcrypt.compareSync(password, user.password, parseInt(process.env.SALTROUND))
        if (compare) {
            if (!user.confirmEmail) {
        res.status(400).json({message:"You have to confirm email first"})

            } else {
                let token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature, { expiresIn: 60 * 60 * 24 * 2 })
                res.status(200).json({ message: "welcome", token, id: user._id })
            }
        } else {
        res.status(400).json({message:"in valid password"})

        }
    }
})
export const getUserData = asyncHandler(async (req, res, next) => {

  let { token } = req.params
  let decoded = jwt.verify(token, process.env.tokenSignature)

  if (!decoded && !decoded.id) {
      res.status(400).json({message:"invalid token data"})

  } else {
      const userData = await findById({ model: userModel, condition: decoded.id })
      if (userData) {
              res.status(200).json({userData})
      } else {
      res.status(404).json({message:"invalid data token"})

      }
  }
})
export const sendMessage = asyncHandler(async (req, res, next) => {

  let {email,message} = req.body
  let messagee = `you have message from: ${email},</a>
  <br/>
  <br/>
  message:${message}</a>
  `
let emailRes = await sendEmail(email, "GALLERY", messagee);
if (emailRes.accepted.length) {
  res.status(200).json({message:'sended'})
return
}

})
