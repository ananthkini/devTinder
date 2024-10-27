const mongoose = require("mongoose");
const validator = require('validator')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    minLength:3,
    maxLength:100,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required:true,
    unique:true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error(' : Invalid Email')
      }
    }
  },
  password: {
    type: String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error(' : Enter a strong password')
      }
    }
  },
  age: {
    type: Number,
    min:18,
  },
  gender: {
    type: String,
    required:true,
    enum:{
      values:["male","female","others"],
      message:'{VALUE} is not a valid gender'
    }
  },
  about:{
    type:String,
    default:"This is a default About of the user"
  },
  skills:{
    type:[String]
  },
  photoUrl:{
    type:String,
    default:"https://www.google.com/imgres?q=user%20icon&imgurl=https%3A%2F%2Fbanner2.cleanpng.com%2F20180622%2Ftqt%2Faazen4lhc.webp&imgrefurl=https%3A%2F%2Fwww.cleanpng.com%2Fpng-computer-icons-user-clip-art-consignee-3997281%2F&docid=n75pdFNNw5VnEM&tbnid=2AQniTaDbK2koM&vet=12ahUKEwjmh4u33KOJAxW9TGwGHSZ8J40QM3oECGcQAA..i&w=900&h=900&hcb=2&ved=2ahUKEwjmh4u33KOJAxW9TGwGHSZ8J40QM3oECGcQAA",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error(" : Enter a valid photo url")
      }
    }
  }

},{
  timestamps:true
});

module.exports = mongoose.model("User", userSchema);
