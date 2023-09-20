import mongoose from "mongoose";
mongoose.set('strictQuery', true);
const connection = async ()=>{
    return await mongoose.connect("mongodb+srv://ziad:00241300@cluster0.bxnbg.mongodb.net/gallery")
    .then(()=> console.log(`connected on ...... `))
    .catch(err=>console.log(`fail to connect `))
}

export default connection;
