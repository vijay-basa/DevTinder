const validator = require('validator');

const validateSignUpData = (req) => {
    if(!req.body?.firstName || !req.body?.lastName) {
        throw new Error("Name is not valid!");
    } else if(!validator.isEmail(req.body?.emailId)) {
        throw new Error("Email is not valid!");
    } else if(!validator.isStrongPassword(req.body?.password)) {
        throw new Error("Please enter a strong password!")
    }
};

const validateLoginData = (emailId, password) => {
    if(!validator.isEmail(emailId)) {
        throw new Error("Please enter valid email!");
    } else if(!password?.trim()) {
        throw new Error("Password is required!")
    }
}

module.exports = {
    validateSignUpData,
    validateLoginData,
}