const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
let users = require("./usersdb.js");

const regd_users = express.Router();

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.

  return users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body.user;
  if (!user) {
    return res.status(404).json({ message: "Body Empty" });
  }

  if (!authenticatedUser(user.username, user.password)) {
    return res
      .status(404)
      .json({ message: "Username or password incorrect! Please try again" });
  }
  // Generate JWT access token
  let accessToken = jwt.sign(
    {
      data: user,
    },
    "access",
    { expiresIn: 60 * 60 }
  );

  // Store access token in session
  req.session.authorization = {
    accessToken,
  };

  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
