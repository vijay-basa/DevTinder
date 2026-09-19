const mongoose = require("mongoose");
const validator = require("validator");

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
		validate(email){
			// const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			// return regex.test(email);
			if(!validator.isEmail(email)) {
				throw new Error("email is not valid " + email);
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: 8,
		maxLength: 25,
		validate(password) {
			if(!validator.isStrongPassword(password)){
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
		validate(value){
			if(!['male', 'female', 'others'].includes(value)){
				throw new Error("Gender data is not valid!");
			}
		}
	},
	photoUrl: {
		type: String,
		default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
		validate(photoUrl) {
			if(!validator.isURL(photoUrl)) {
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

module.exports = mongoose.model("User", userSchema);
