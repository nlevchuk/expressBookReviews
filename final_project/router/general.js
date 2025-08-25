import express from 'express';
import {
  getAllBooks,
  findBookByISBN,
  findBooksByAuthor,
  findBooksByTitle,
} from './booksdb.js';
import { isValid, registerUser } from './auth_users.js';

const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and/or password are not provided' });
  }

  if (isValid(username)) {
    res.status(409).json({ message: "User already exists!" });
  } else {
    registerUser(username, password);
    res.status(200).json({ message: "User has been registered successfully!" });
  }
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
  
// Get all books based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  // Note! An author can have more than one book
  const books = findBooksByAuthor(author);

  if (books.length > 0) {
    return res.status(200).json(books);
  } else {
    return res.status(404).json({ message: `Books with author ${author} not found` });
  }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  // Note! More than one book can have similar titles
  const books = findBooksByTitle(title);

  if (books.length > 0) {
    return res.status(200).json(books);
  } else {
    return res.status(404).json({ message: `Books with title ${title} not found` });
  }
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = Number.parseInt(req.params.isbn);
  const book = findBookByISBN(isbn);
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  return res.status(200).json(book.reviews);
});

export { public_users as general }
