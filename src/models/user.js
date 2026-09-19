const mongoose = require("mongoose");

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
			const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return regex.test(email);
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: 8,
		maxLength: 25
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
		default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
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
