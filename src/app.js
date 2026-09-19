const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require('./models/user.js');
const { validateSignUpData, validateLoginData } = require("./utils/validations.js");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());


// Feed GET API - get all the users from DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
})

// User GET API - get user by emailId from DB
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    // const user = await User.findOne({ emailId: userEmail });
    // const user = await User.findOne();
    // const user = await User.findById({ _id: "6aae2a5bc19d38a46d02fe6b" });
    if(users.length === 0) {
      res.status(404).send("No User Found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Signup POST API - signup new user in DB
app.post('/signup', async (req, res) => {
  try {
    // Validate the data
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName, 
      lastName, 
      emailId, 
      password: hashedPassword,
    });
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(500).send("ERROR : " + err.message)
  }

});

// Login POST API - login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(email, password);

    const user = await User.findOne({ emailId: email });
    if(!user) {
      throw new Error("Invalid credential!");
    }

    const isValidUser = await bcrypt.compare(password, user.password);
    if(!isValidUser) {
      throw new Error("Invalid credentials");
    }
    res.send("Login successfully!");

  } catch(err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

// User PATCH API - update user by Id or emailId in DB
app.patch("/user/:userId", async (req, res) => {
  try {
    const data = req.body;
    const userId = req.params?.userId;

    const ALLOWED_UPDATES = [
      "firstName", "lastName", "password", "age", "gender", "photoUrl", "about", "skills"
    ]

    const isAllowedUpdate = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

    if(!isAllowedUpdate) {
      throw new Error("data is not allowed to update");
    }

    if(data?.skills?.length > 10) {
      throw new Error("more than 10 skills are not allowed")
    }

    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    // const updateUser = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: 'after', runValidators: true });

    // const userEmail = req.body.emailId;
    // const updateUser = await User.findOneAndUpdate({ emailId: userEmail }, data, { returnDocument: "before", runValidators: true });
    // console.log(updateUser);

    res.send("User update success!");
  } catch (err) {
    res.status(400).send("User update failed " + err.message);
  }
})

// User DELETE API - delete user by Id from DB
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    // await User.findByIdAndDelete(userId);
    await User.findByIdAndDelete({ _id: userId });
    res.send("User delete success!")
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
})

connectDB()
  .then((data) => {
    console.log("Database connection establisheds");
    app.listen(7777, () => {
      console.log("Server started successfylly on Port 7777");
    })
  })
  .catch((err) => console.error("Database connection failed"));
