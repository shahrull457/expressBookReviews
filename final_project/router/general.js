const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if both fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  let existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Add new user
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //Write your code here
  const isbn = req.params.isbn;   // retrieve ISBN from request parameters

  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book, null, 2));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;   // retrieve author from request parameters

  // Filter books by matching author (case-insensitive)
  let result = {};
  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  if (Object.keys(result).length > 0) {
    res.send(JSON.stringify(result, null, 2));
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;   // retrieve title from request parameters

  // Filter books by matching title (case-insensitive)
  let result = {};
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  if (Object.keys(result).length > 0) {
    res.send(JSON.stringify(result, null, 2));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;   // retrieve ISBN from request parameters

  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 2));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
