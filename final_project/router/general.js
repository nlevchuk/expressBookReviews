import express from 'express';
import { isValid, users } from './auth_users.js';
import { getAllBooks, findBookByISBN } from './booksdb.js';

const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  const books = getAllBooks();
  // Note! The task hint says to use JSON.stringify to show data nicely on the client.
  // It is not necessary since "res.json" already does the stringifying and sets the right Content-Type.
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = Number.parseInt(req.params.isbn);
  const book = findBookByISBN(isbn);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

export { public_users as general }
