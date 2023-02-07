require('dotenv').config()
const mongoose = require('mongoose')

//mongoose.connect(process.env.MONGO_URI,(err)=>console.log('connected....'))
mongoose.connect('mongodb://localhost:27017/CustomerData',(err)=>console.log('connected....'))

const ProductSchema =  mongoose.Schema({
    productname:String,
    category:String,
    description:String,
    price:String,
    quantity:String,
    image:{
        type:String
    },
    feature:Boolean
    
})

const StatUser =  mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
   usercart:{
        type:Array
      }
})
// const Product= mongoose.model('Product',ProductSchema)
// const User = mongoose.model('User',StatUser)
//module.exports = {Product,User}



mongoose.models={}

const Product = mongoose.model.Product || mongoose.model('Product',ProductSchema)
const User = mongoose.model.User || mongoose.model('User',StatUser)
 
 module.exports = {Product,User}

