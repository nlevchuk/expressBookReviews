import express from 'express';
import jwt from 'jsonwebtoken';
import books from './booksdb.js';

const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  const user = users.find(u => u.username === username);
  return user !== undefined;
}

const authenticatedUser = (username, password) => { //returns boolean
//write code to check if username and password match the one we have in records.
}

const registerUser = (username, password) => users.push({ username, password });

// Only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

export {
  isValid,
  users, // Exclude from the export
  registerUser,
  regd_users as authenticated,
}
