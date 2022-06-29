const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: { 
        type: String,
         required: true
         },
    lname: {
         type: String, 
         required: true
         },
    email: {
         type: String, 
         required: true
         },
    
    phone: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
         type: String, 
        required: true,
         minLen: 8, 
         maxLen: 15
         }, 

    role:{
      type:String,
      default:'taxPayer',
      enum:['taxPayer','taxAccountant','admin']

    },

  deletedAt: { 
      type: Date,
  },
  
  isDeleted: {
      type: Boolean,
      default: false
  },
    
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);