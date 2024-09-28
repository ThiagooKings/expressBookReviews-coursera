const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
let users = require("./usersdb.js");

const regd_users = express.Router();

const isValid = (username) => {
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
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
      data: user.username,
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
  let isbn = req.params.isbn;

  let rate = req.body.rate;
  let comment = req.body.comment;
  let username = jwt.decode(req.session.authorization.accessToken).data;

  if (!books[isbn]) {
    res.status(404).json({ message: "Book not found!" });
  }

  let lengthOfReview = Object.keys(books[isbn].reviews).length;

  if (lengthOfReview !== 0) {
    for (let i in books[isbn].reviews) {
      if (books[isbn].reviews[i].reviewedByUser == username) {
        books[isbn].reviews[i] = { rate, comment, reviewedByUser: username };

        return res.status(200).send(JSON.stringify(books[isbn]));
      }
    }

    books[isbn].reviews[lengthOfReview + 1] = {
      rate,
      comment,
      reviewedByUser: username,
    };

    return res.status(201).send(JSON.stringify(books[isbn]));
  }
  books[isbn].reviews = { 1: { rate, comment, reviewedByUser: username } };

  return res.status(201).send(JSON.stringify(books[isbn]));
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = jwt.decode(req.session.authorization.accessToken).data;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found!" });
  }

  let lengthOfReview = Object.keys(books[isbn].reviews).length;

  if (lengthOfReview !== 0) {
    for (let i in books[isbn].reviews) {
      if (books[isbn].reviews[i].reviewedByUser == username) {
        delete books[isbn].reviews[i];

        return res.status(200).send(JSON.stringify(books[isbn]));
      }
    }
  }

  return res.status(404).json({ message: "Review not found!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
