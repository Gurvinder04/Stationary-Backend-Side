const jwt = require('jsonwebtoken')
const User = require('../Models')
var cookie = require('cookie');


const authorize = async(req,res,next)=>{
    try {
        const token = req.cookies.firstjwt
        console.log('authorize token is',token)
        const checkToken = jwt.verify(token,process.env.SECRET_KEY)
        console.log('checking token...',checkToken)
        // const loggedUser= await User.find({_id:_id})
        // console.log('token user detail',loggedUser)
        
       //res.send(checkToken)
       req.body = checkToken
        next()
        
        
    } catch (error) {
        //res.status(401).send(error)
        console.log('errorrrr')
        
    }
}


module.exports = authorize