const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;

  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "User name and/or passoword are empty!" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  let newUser = { firstName, lastName, username, email, password };
  users.push(newUser);

  return res.status(201).send(JSON.stringify({ newUser }));
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify({ books }));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn]));
  }

  return res.status(404).json({ message: "Book not found!" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let foundByAuthor = [];

  for (let i in books) {
    if (books[i].author === author) {
      foundByAuthor.push(books[i]);
    }
  }

  if (foundByAuthor) {
    return res.send(JSON.stringify({ foundByAuthor }));
  }

  return res.status(404).json({ message: "Book not found!" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let foundByTitle;

  for (let i in books) {
    if (books[i].title === title) {
      foundByTitle = books[i];
      break;
    }
  }

  if (foundByTitle) {
    return res.send(JSON.stringify({ foundByTitle }));
  }

  return res.status(404).json({ message: "Book not found!" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews));
  }

  return res.status(404).json({ message: "Book not found!" });
});

module.exports.general = public_users;
