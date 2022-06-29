const jwt=require('jsonwebtoken')
const { default: mongoose } = require("mongoose")
const userModel = require("./Models/userModel")



 let isValidObjectId=function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}


let authenticateUser = function (req, res, next) {
    try {
        token = req.headers["authorization"]
        if (!token) {
            return res.status(401).send({ status: false, message: "token required" })
        }
         if(token.startsWith('Bearer')){
             token=token.slice(7,token.length)
         }

        let decodedToken = jwt.verify(token, 'Secret-Key-given-by-us-to-secure-our-token')
        if (!decodedToken) {
            return res.status(401).send({ status: false, message: "token is invalid" })
        }
        req.userId=decodedToken.userId
        next()
    } catch (error) {
        res.status(500).send({ status: false, ERROR: error.message })
    }
}





const authorization = async function (req, res, next) {

    try {
        const decodedToken = req.decodedToken;
        let userId = req.params.userId


        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "Enter Valid objectId" })


        let isPresentUser = await userModel.findById(userId)
        if (!isPresentUser) return res.status(404).send({ status: false, msg: "User not found" })
        
        if(isPresentUser.role == 'taxAccountant'|| isPresentUser.role == ' admin'){
            next()
        }
        else{
            if (userId != decodedToken.userId) return res.status(401).send({ status: false, msg: "unauthorize access " })
        }
        
        next()

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: "error occure for more information move on console", error: err.message })
    }
}


module.exports={authenticateUser,authorization}