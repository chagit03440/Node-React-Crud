// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Sample book data
let books = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
];

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Get all books
app.get('/', (req, res) => {
  res.json(books);
});

// Get a specific book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Add a new book
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (title && author) {
    const newBook = {
      id: books.length ? books[books.length - 1].id + 1 : 1,
      title,
      author
    };
    books.push(newBook);
    res.status(201).json(newBook);
  } else {
    res.status(400).json({ message: 'Title and author are required' });
  }
});

// Update a book by ID
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (book) {
    const { title, author } = req.body;
    book.title = title || book.title;
    book.author = author || book.author;
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex !== -1) {
    const deletedBook = books.splice(bookIndex, 1);
    res.json(deletedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
