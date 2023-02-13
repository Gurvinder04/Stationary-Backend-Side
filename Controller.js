require('dotenv').config()
const {User} = require('./Models')
const {Product} = require('./Models')


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookie = require('cookie');
var cookieParser = require('cookie-parser')
const authorize = require('./Middleware/authorize')
const fs = require('fs')
const { ok } = require('assert')

module.exports = {
    showProducts: async function  (req,res) {
        console.log('showing products')
        const data = await Product.find()
        res.send(data)
    },
    allUser: async function  (req,res) {
        console.log('showing Users')
        const data = await User.find()
        console.log('users are',data)
    },

     
    getCart:function(req,res){
        let uid = req.body._id
        User.findById({_id:uid})
        .then(output=>{
            console.log('testing',output.usercart)
            res.send(output.usercart)
           
        }) 

    },

    productById: async function (req,res) {
        //console.log('with id')
        const rid = req.params.id
        const data = await Product.findById({ _id: rid })
        //console.log(data)
        res.send(data)
    },

    userLogout: async function(req,res){
        try {
            res.clearCookie("firstjwt")
             console.log('logout successfully')
             res.send(req.body)
         } catch (error) {
             res.status(500).send(error)
        }

    },

    addProducts: async function (req,res) {
        //console.log(req.body.file, 'sucesssssssss')
        //console.log(req.files)
        const newProduct = new Product({ 
            productname: req.body.productname, 
            category: req.body.category,
             description: req.body.description,
             price: req.body.rate, 
             quantity: req.body.quantity, 
             image: req.file.filename })

        newProduct.save()
            .then(result => {
                console.log('successfully saved')
                res.json({
                    message:"ok",
                    data:result
                })
            })
    },
    addCart:function (req,res){ 
        const {product,checkUser} = req.body
        //console.log('backend id',checkUser)
        //console.log('backend product',product)
        User.updateOne({_id:checkUser},{$push:{ usercart:product}})
        .then(output=>{
            res.json({
                msg:"ok",
                data:output
            })
        })
    },

    adminSign: async function (req,res) {
        console.log('entered Admin panel login')
        const { email, password } = req.body
        console.log(email, password)
        User.findOne({ email: email })
            .then(user => {
                //console.log(result)
                if (user.length > 0) {
                    console.log(user)
                }
                else {
                    res.json({
                        msg: 'username or password incorrect'
                    })
                }
            })

    },

    userSign: async function (req,res) {
        console.log('entered')
        const password = bcrypt.hashSync(req.body.password,10)
        console.log(req.body)
        const user_data = new User({
           firstname: req.body.firstname,
           lastname: req.body.lastname, 
           email: req.body.email, 
           password:password,
           })
        user_data.save()
              .then(result => {
                  console.log('successfully saved')
              })
    },

    userLogin: async function (req,res) {
        console.log('entered login')
        const { email, password } = req.body
        console.log(email, password)
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //console.log('user is', user)
                    let tokens = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
                    // res.cookie("firstjwt", tokens, {
                    //     expires: new Date(Date.now() + 50000),
                    //      domain: 'https://stationary-backend-side.onrender.com',
                    //      //path: "/",
                    //     httpOnly: true,
                    //     sameSite:'none' 
                    // });
                    //console.log('user cookie is', res.cookie.firstjwt)
                    const user1={
                        email:user.email,
                        _id:user._id,
                        usercart:user.usercart,
                        tokens:tokens
                    }
                    
                    res.status(201).send(JSON.stringify(user1))
                }
                else {
                    console.log('login else part running')
                    console.log(user)
                    res.status(404).send(user)
                }
            })
    },

    updateProducts: async function (req,res) {
        const uid = req.params.id
        let data = Product.findById(uid)
        res.send(data)
    },

    deleteProducts: async function (req,res) {
        console.log('deleting processss')
        let data = await Product.findByIdAndDelete({ _id: req.params.id })
        console.log('hey u did it')
        res.send(data)
    },

    deleteCart:  function(req,res){
        const {id,loggedId} = req.body
        //console.log('logged id',loggedId)
         //console.log('deleting processss',id)
             let data = User.updateOne({ _id:loggedId},
                 { $pull: { usercart: {_id:id } } }
              );
            console.log('hey u did it',data)
          User.findById({_id:loggedId})
          .then(out=>{
               console.log('OUTPUT',out.usercart)
            })
            //res.send(JSON.stringify(data))
    
    }


}
