export const serializeAuthoredBooks = (books) => {
  const result = Object.entries(books)
    .reduce((acc, [isbn, { title, reviews }]) => {
      return [...acc, { isbn, title, reviews }];
    }, []);

  return { booksByAuthor: result };
};
