import express from 'express';
import {
  getAllBooks,
  findBookByISBN,
  findBooksByAuthor,
  findBooksByTitle,
} from './booksdb.js';
import { isValid, registerUser } from './auth_users.js';
import {
  serializeAuthoredBooks,
  serializeTitledBooks,
} from '../serializers/book.serializer.js';

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
/*
  // Using Promises
  public_users.get('/', (req, res) => {
    return getAllBooks().then(books => res.status(200).json(books));
  });
 
  // Using async/await
  public_users.get('/', async (req, res) => {
    const books = await getAllBooks();
    return res.status(200).json(books);
  });

  // Modified version of the function localed in the booksdb.js
  export const getAllBooks = () => Promise.resolve(books);
  OR
  export const getAllBooks = () => new Promise((resolve) => resolve(books));
*/

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
/*
  // Using Promises
  public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = Number.parseInt(req.params.isbn);

    return findBookByISBN(isbn).then(book => {
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
      }
    });
  });

  // Using async/await
  public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = Number.parseInt(req.params.isbn);
    const book = await findBookByISBN(isbn);

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  });

  // Modified version of the function localed in the booksdb.js
  export const findBookByISBN = (isbn) => Promise.resolve(books[isbn]);
  OR
  export const findBookByISBN = (isbn) => new Promise((resolve) => resolve(books[isbn]));
*/
  
// Get all books based on author
public_users.get('/author/:author', (req, res) => {
  const author = (req.params.author + "").toLocaleLowerCase();
  const books = findBooksByAuthor(author);

  if (Object.keys(books).length > 0) {
    return res.status(200).json(serializeAuthoredBooks(books));
  } else {
    return res.status(404).json({ message: `Books with author ${author} not found` });
  }
});
/*
  // Using Promises
  public_users.get('/author/:author', (req, res) => {
    const author = (req.params.author + "").toLocaleLowerCase();

    return findBooksByAuthor(author)
      .then(books => res.status(200).json(serializeAuthoredBooks(books)))
      .catch((error) => {
        return res.status(404).json({ message: `Books with author ${author} not found` });
      });
  });

  // Using async/await
  public_users.get('/author/:author', async (req, res) => {
    const author = (req.params.author + "").toLocaleLowerCase();

    try {
      const books = await findBooksByAuthor(author);
      return res.status(200).json(serializeAuthoredBooks(books));
    } catch (error) {
      return res.status(404).json({ message: `Books with author ${author} not found` });
    }
  });

  // Modified version of the function localed in the booksdb.js
  export const findBooksByAuthor = (author) => new Promise((resolve, reject) => {
    const result = {};
    for (const [isbn, book] of Object.entries(books)) {
      if (book.author.toLocaleLowerCase().match(author)) {
        result[isbn] = book;
      }
    }
    return Object.keys(result).length > 0 ? resolve(result) : reject(null);
  });
*/

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = (req.params.title + "").toLocaleLowerCase();
  const books = findBooksByTitle(title);

  if (Object.keys(books).length > 0) {
    return res.status(200).json(serializeTitledBooks(books));
  } else {
    return res.status(404).json({ message: `Books with title ${title} not found` });
  }
});
/*
  // Using Promises
  public_users.get('/title/:title', (req, res) => {
    const title = (req.params.title + "").toLocaleLowerCase();

    return findBooksByTitle(title).then((books) => {
      if (Object.keys(books).length > 0) {
        return res.status(200).json(serializeTitledBooks(books));
      } else {
        return res.status(404).json({ message: `Books with title ${title} not found` });
      }
    });
  });

  // Using async/await
  public_users.get('/title/:title', async (req, res) => {
    const title = (req.params.title + "").toLocaleLowerCase();
    const books = await findBooksByTitle(title);

    if (Object.keys(books).length > 0) {
      return res.status(200).json(serializeTitledBooks(books));
    } else {
      return res.status(404).json({ message: `Books with title ${title} not found` });
    }
  });

  // Modified version of the function localed in the booksdb.js
  export const findBooksByTitle = (title) => {
    const result = {};
    for (const [isbn, book] of Object.entries(books)) {
      if (book.title.toLocaleLowerCase().match(title)) {
        result[isbn] = book;
      }
    }
    return Promise.resolve(result);
  }
*/

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
