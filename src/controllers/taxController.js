const taxModel =  require('../models/taxModel')
const mongoose=require('mongoose')
const { findOneAndUpdate } = require('../models/userModel')
const userModel = require('../models/userModel')


let isValidObjectId=function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}


const userTaxCreation = async function(req,res){
    try{  
    const taxData = req.body
    
    if (Object.keys(taxData).length ==0) {
         return res.status(400).send({ status: "false", message: "Please ptovide required input fields" }) }
    const{ userId,totalSales,city,date,SGST,CGST,taxSlab,taxStatus} = taxData

    if(isValidObjectId(userId)){
        return res.status(400).send({status:false,msg:"please provide valid userId"})
    }

    const userCheck = await userModel.findById(userId)
    if(!userCheck){
        return res.status(404).send({status:false,msg:"no such user found "})
    }
    else{
        if(userCheck.role=='admin'||userCheck.role=='taxAccountant'){

            return res.status(404).send({status:false,msg:"you are not a taxpayer  "})
        }
    }

    let UT =["Andaman and Nicobar","Chandigarh","Daman and Diu","Dadar and Nagar Haveli","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep"]
    
    CGST = (totalSales*taxSlab)/100
    SGST = CGST


     if(UT.indexOf(city)!== -1 ){
        SGST = 0 
     }
   
    let totalTax = SGST+CGST

    let modelData = {
        "userId":userId,
        "totalSales": totalSales ,
        "City": city,
        "date" : date,
        "SGST":SGST,
        "CGST":CGST,
        "taxSlab" : taxSlab,
        "taxStatus" : taxStatus,  
        "totalTax":totalTax

    }
    let createdData = await taxModel.create(modelData)

    return res.status(201).send({status:true, data:createdData})
    }
    catch(err){

        return res.status(500).send({status:false,msg:err.message})
    }
}



const editTaxPayer = async function (req,res){
    try{
    if(user[role]=='taxPayer'){
        return res.send(' only tax accountant and admin are allowed for this api  ')
    }
    let userId = req.params.userId 

    const toUpdate  = req.body
   
    const updated = await findOneAndUpdate(userId,toUpdate)

    res.status(200).send({status:true,message:updated})
}catch(e){
    res.status(500).send({message:e})
}
}







const getTaxDetailsByUserId = async function (req,res){
    try{
    let userId = req.params.userId
    const userCheck = await userModel.findById(userId)

    if(!userCheck){
        return 
    }
    let userTaxes = await taxModel.find({userId}) 
    console.log(userTaxes)

    return res.send(userTaxes)
}catch(e){
    res.status(500).send({message:e})
}
}



const getTaxDetailsFiltres = async function(req,res){
try{
    let filters = req.query
    
    filters ={userId, data , taxStatus }
    
    if(user[role]== 'taxPayer'){
        if (userId !== decodedToken.userId ){
             return res.send("you are  not authorized to do that ")
        }

        else{
            const userDetailsByfilter = await taxModel.findById(userId) 
        }
    }

    else{
        const filteredProducts  = await taxModel.find(filters)

        res.send(filteredProducts)

    }

}catch(e){
    res.status(500).send({message:e})
}
}


const markTaxPaid = async function(req,res){
try{
    let userId  = req.params.userId
    let newStatus = req.query.status
    let taxId  = req.query.taxId  
    let userCheck = await userModel.findById(userId)
    if(!userCheck ){
        return res.send('no such user Found ')
    }

    let taxIdCheck = await taxModel.findById(taxId)
    if(!taxIdCheck){
        return res.send(' no tax record Found ')
    }

    let updated = await taxModel.findOneAndUpdate(taxId,{taxStatus:newStatus},{new:true})
    res.send(updated)
}catch(e){
    res.status(500).send({message:e})
}
}




const createAndEditTaxDue = async function(req,res){
    try{
     let userId =req.params.userId
     let taxDueStatus = req.query.taxDueStatus
     let taxId  = req.query.taxId 

     let userCheck = await userModel.findById(userId)
    if(!userCheck ){
        return res.send('no such user Found ')
    }
    if(userCheck.role!== 'taxAccountant'){

        return res.send(' only tax accountant allowed ')

    }
    if(userCheck.taxStatus == 'paid'){
        return res.send(' tax Already paid by user ')
    }

    let taxIdCheck = await taxModel.findById(taxId)
    if(!taxIdCheck){
        return res.send(' no tax record Found ')
    }

    let updated = await taxModel.findOneAndUpdate(taxId,{taxDue:taxDueStatus},{new:true})

    return res.status(200).send(updated)
}catch(e){
    res.status(500).send({message:e})
}
}

module.exports={
    userTaxCreation,getTaxDetailsByUserId,getTaxDetailsFiltres, markTaxPaid ,createAndEditTaxDue, editTaxPayer
  }