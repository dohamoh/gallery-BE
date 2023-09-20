import { Router } from "express";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import * as productControl from './controller/product.controller.js'
import * as commentsControl from './controller/comment.controller.js'
const router = Router()
router.get("/", (req, res) => {
    res.status(200).json({ message: 'product Module' })
})

router.post("/add", myMulter(fileValidation.image).array("image"), HME,productControl.add)
router.get("/getProducts",productControl.getProducts)
router.get("/getProduct/:id",productControl.getProduct)
router.put("/update",myMulter(fileValidation.image).array("image"), HME,productControl.update)
router.put("/hideProd",productControl.hideProd)
router.put("/like",productControl.like)
router.delete("/deleteProduct/:id",productControl.deleteProduct)

router.put("/addComment", commentsControl.addComment)
router.put("/deleteComment", commentsControl.deleteComment)
router.put("/hideComment", commentsControl.hideComment)
router.put("/addReply", commentsControl.addReply)

export default router
