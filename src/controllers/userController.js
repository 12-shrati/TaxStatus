const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let isValidObjectId=function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}



const registerUser = async function (req, res) {
    try {
        const userData = req.body

        if (Object.keys(userData).length == 0) { return res.status(400).send({ status: "false", message: "Please ptovide required input fields" }) }
        const { fname, lname, email, phone, password, role } = userData
        if (!fname) { return res.status(400).send({ status: "false", message: "Please enter first name" }) }
        if (!lname) { return res.status(400).send({ status: "false", message: "Please enter last name" }) }
        if (!email) { return res.status(400).send({ status: "false", message: "Please enter email" }) }

        if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) return res.status(400).send({ status: false, message: ` Email should be valid email` })
        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: `Email Already Present` });
        }

        if (/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "please provide a valid phone number" });
        }

        let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: `Phone Number Already Present` });
        }
        if (!password.trim()) { return res.status(400).send({ status: "false", message: "Please enter a  password" }) }
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " });
        }

        if (['taxPayer', 'taxAccountant', 'admin'].indexOf(role) == -1) {
            return res.status(400).send({ status: false, msg: "please select in bw ['taxPayer','taxAccountant','admin']" })
        }
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        userData.password = hashedPassword

        const updatedData = {
            "fname": fname,
            "lname": lname,
            "email": email,
            "phone": phone,
            "password": hash,
            "role": role,

        }
        let user = await userModel.create(updatedData)
        return res.status(201).send({ status: true, message: "user registered succesfully", data: user })
    }
    catch (err) {
        return res.status(500).send({ status: "false", message: err.message })
    }
}



const loginUser = async function (req, res) {
    try {

        const requestBody = req.body
        
        if (Object.keys(requestBody).length > 2 ||Object.keys(requestBody).length==0) {
        return res.status(400).send({ status: false, msg: "you must pass email and password" })
        }

        const { email, password } = requestBody
        if (!email){
             return res.status(400).send({ status: false, message: "email required"})
        }

        if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) 
        {return res.status(400).send({ status: false, message: 'Enter Valid email' })}

        const user = await userModel.findOne({ email })
        if (!user) return res.status(404).send({ status: false, message: ` Key Name : 'email' Your email is not found ` })
        
        if (!password) return res.status(400).send({ status: false, message: 'password require' })
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " });
        }

        const validUserPassword = await bcrypt.compare(
            password,
            userMatch.password
        );
        if (!validUserPassword) {
            return res.status(401).send({ status: false, message: "Invalid password" });
        }

        const token = jwt.sign({
            userId: user._id
        }, "Secret-Key-given-by-us-to-secure-our-token")

        res.setHeader('authorization', token)
     
        return res.status(200).send({ status: true, msg: `User login successfully`, token: token })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message, msg: "more details move on console", })
    }

}


const getUser = async function (req, res) {
    try {
        const userId = req.params.userId

        if (isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "Enter Valid ObjectId" })

        const userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, msg: "no data found" })

        return res.status(200).send({ status: true, msg: "data found successfully", data: userData })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message, msg: "more details move on console", })
    }

}


module.exports = { registerUser, loginUser, getUser }