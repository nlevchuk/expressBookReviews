import express from 'express';
import jwt from 'jsonwebtoken';
import {
  findBookByISBN,
  addReviewToBook,
  findReviewToBook,
  removeReviewFromBook,
} from './booksdb.js';

let users = [];

const expirationTime = 60 * 60; // 1 hour

const isValid = (username) => { //returns boolean
  const user = users.find(u => u.username === username);
  return user !== undefined;
}

const authenticatedUser = (username, password) => { //returns boolean
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  return user !== undefined;
}

const registerUser = (username, password) => users.push({ username, password });

const regd_users = express.Router();

// Only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and/or password are not provided' });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { data: password},
      'access',
      { expiresIn: expirationTime }
    );
    req.session.authorization = { username, accessToken };

    return res.status(200).json({ message: `User ${username} successfully logged in` });
  } else {
    return res.status(404).json({ message: 'User with provided username and password not found. Go to /register first' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = Number.parseInt(req.params.isbn);
  const book = findBookByISBN(isbn);
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  const { review } = req.query;
  if (!review) {
    return res.status(400).json({ message: 'The "review" query parameter is missing or empty' });
  }

  const { username } = req.session.authorization;
  addReviewToBook(isbn, review, username);
  return res.status(200).json({ message: `Review for "${book.title}" has been added successfully` });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = Number.parseInt(req.params.isbn);
  const book = findBookByISBN(isbn);
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  const { username } = req.session.authorization;
  const userReview = findReviewToBook(isbn, username);
  if (!userReview) {
    return res.status(404).json({ message: "User's review not found" });
  }

  removeReviewFromBook(isbn, username);
  return res.status(200).json({ message: `Review for "${book.title}" has been deleted successfully` });
});

export {
  isValid,
  registerUser,
  regd_users as authenticated,
}
