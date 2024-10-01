const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Register new user
public_users.post("/register", (req, res) => {
  let { username, password, firstName, lastName, email } = req.body;

  return new Promise((resolve, reject) => {
    if (!username || !password) {
      reject(
        res
          .status(404)
          .json({ message: "User name and/or password are empty!" })
      );
    } else if (!isValid(username)) {
      reject(res.status(404).json({ message: "User already exists!" }));
    } else {
      let newUser = { firstName, lastName, username, email, password };
      users.push(newUser);
      resolve(res.status(201).send(JSON.stringify({ newUser })));
    }
  }).catch((error) => {
    res.status(500).json({ message: "Error registering user", error: error });
  });
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  return new Promise((resolve) => {
    resolve(res.send(JSON.stringify({ books })));
  }).catch((error) => {
    res.status(500).json({ message: "Error fetching book list.", error });
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  let isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(res.send(JSON.stringify(books[isbn])));
    } else {
      reject(res.status(404).json({ message: "Book not found!" }));
    }
  }).catch((error) => {
    res.status(500).json({ message: "Error fetching book by ISBN.", error });
  });
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  let author = req.params.author;

  return new Promise((resolve, reject) => {
    let foundByAuthor = [];

    for (let i in books) {
      if (books[i].author === author) {
        foundByAuthor.push(books[i]);
      }
    }

    if (foundByAuthor.length > 0) {
      resolve(res.send(JSON.stringify({ foundByAuthor })));
    } else {
      reject(res.status(404).json({ message: "Book not found!" }));
    }
  }).catch((error) => {
    res.status(500).json({ message: "Error fetching book by author.", error });
  });
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  let title = req.params.title;

  return new Promise((resolve, reject) => {
    let foundByTitle = null;

    for (let i in books) {
      if (books[i].title === title) {
        foundByTitle = books[i];
        break;
      }
    }

    if (foundByTitle) {
      resolve(res.send(JSON.stringify({ foundByTitle })));
    } else {
      reject(res.status(404).json({ message: "Book not found!" }));
    }
  }).catch((error) => {
    res.status(500).json({ message: "Error fetching book by title.", error });
  });
});

//  Get book review by isbn
public_users.get("/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(res.send(JSON.stringify(books[isbn].reviews)));
    } else {
      reject(res.status(404).json({ message: "Book not found!" }));
    }
  }).catch((error) => {
    res.status(500).json({ message: "Error fetching book review.", error });
  });
});

module.exports.general = public_users;
