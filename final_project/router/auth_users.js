const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

const SECRET_KEY = "secrect123"; // must match index.js

const isValid = (username) => !users.find(u => u.username === username);
const authenticatedUser = (username, password) =>
  users.find(u => u.username === username && u.password === password);

// Register
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });
  if (!isValid(username)) return res.status(400).json({ message: "User already exists" });

  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

// Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// Add/Update review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!review) return res.status(400).json({ message: "Review text required" });

  let book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  book.reviews[username] = review;
  res.json({ message: "Review added/updated", reviews: book.reviews });
});

// delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: book.reviews
    });
  } else {
    return res.status(404).json({ message: "You have no review to delete for this book" });
  }
});

module.exports = regd_users;
