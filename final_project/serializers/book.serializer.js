export const serializeAuthoredBooks = (books) => {
  const result = Object.entries(books)
    .reduce((acc, [isbn, { title, reviews }]) => {
      return [...acc, { isbn, title, reviews }];
    }, []);

  return { booksByAuthor: result };
};

export const serializeTitledBooks = (books) => {
  const result = Object.entries(books)
    .reduce((acc, [isbn, { author, reviews }]) => {
      return [...acc, { isbn, author, reviews }];
    }, []);

  return { booksByTitle: result };
};
