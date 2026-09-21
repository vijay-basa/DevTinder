const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 4,
    maxLength: 25,
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: 25,
  },
  emailId: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    validate(email) {
      // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // return regex.test(email);
      if (!validator.isEmail(email)) {
        throw new Error("email is not valid " + email);
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(password) {
      if (!validator.isStrongPassword(password)) {
        throw new Error("Not a strong password " + password);
      }
    }
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    trim: true,
    lowercase: true,
    // validate(value) {
    //   if (!['male', 'female', 'others'].includes(value)) {
    //     throw new Error("Gender data is not valid!");
    //   }
    // }
    enum: {
      values: [ "male", "female", "others" ],
      message: `{VALUE} is not a valid gender`,
    }
  },
  photoUrl: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
    validate(photoUrl) {
      if (!validator.isURL(photoUrl)) {
        throw new Error("Not a valid URL")
      }
    }
  },
  about: {
    type: String,
    default: "This is the description about user!"
  },
  skills: {
    type: [String]
  }
}, {
  timestamps: true
})

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "$DevTinder&SECRET", { expiresIn: "7d" });
  return token;
};

userSchema.methods.validatePassword = async function (inputPasswordFromUser) {
  const user = this;
  const hashedPassword = user.password;

  const isValidPassword = await bcrypt.compare(inputPasswordFromUser, hashedPassword);
  return isValidPassword;
}

module.exports = mongoose.model("User", userSchema)
