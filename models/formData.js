const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  sale:{
    type:String,
    required:true
  },
  price:{
    type:Number
  },
  formPicture:{
    type:String,
    required:true
  }

})

module.exports = mongoose.model('FormData',formSchema)