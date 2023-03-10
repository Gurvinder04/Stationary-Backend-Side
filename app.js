require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var cookie = require('cookie');
var cookieParser = require('cookie-parser')
const authorize = require('./Middleware/authorize')
const {User} = require('./Models')
const {Product} = require('./Models')
const{showProducts,allUser,productById,addProducts,adminSign,userSign,userLogin,userLogout,updateProducts,deleteProducts,addCart,getCart,deleteCart} = require('./Controller')
const admin = express()



//middleware
admin.use(express.json())
admin.use(cors())
admin.use(cookieParser())
//admin.use('/uploads',express.static('./uploads'))
//admin.use('https://stationary-backend-side.onrender.com/Uploads',express.static(path.join(__dirname, 'public')))
admin.use('/static', express.static(path.join(__dirname, 'public')))

const Storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null, './public/Uploads/'),
    filename:(req,file,cb)=>cb(null, file.originalname + "_" + Date.now() +path.extname(file.originalname))
})
const upload = multer({
   storage: Storage
})

admin.get('/product',showProducts)
admin.get('/product/:id',productById)
admin.get('/cart',authorize,getCart)
admin.get('/logout',authorize,userLogout)
admin.get('/users',allUser)

admin.post('/product',upload.single('fileimage'), addProducts)
admin.post('/sign',adminSign)
admin.post('/signin',userSign)
admin.post('/login',userLogin)
admin.post('/cart',addCart)

admin.patch('/product/:id',updateProducts)
admin.delete('/product/:id',deleteProducts)
admin.delete('/cart',deleteCart)

admin.listen(process.env.PORT,(err)=>console.log('running on 4000'))

