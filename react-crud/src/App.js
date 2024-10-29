import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]); 
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);

  const fetchBooks = async () => {
    const response = await fetch('http://localhost:5000');
    const data = await response.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks(); 
  }, []);

  const handleSave = async () => {
    if (isEditing) {
      // Update book
      await fetch(`http://localhost:5000/books/${currentBookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author }),
      });

      setIsEditing(false);
      setCurrentBookId(null);
    } else {
      // Add new book
      await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author }),
      });
    }

    setTitle('');
    setAuthor('');
    fetchBooks(); // Refresh the book list
  };

  const editBook = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setIsEditing(true);
    setCurrentBookId(book.id);
  };

  const deleteBook = async (bookId) => {
    await fetch(`http://localhost:5000/books/${bookId}`, {
      method: 'DELETE',
    });
    fetchBooks(); // Refresh the book list
  };

  return (
    <div className="App">
      <h1>Book Store</h1>
      <input 
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input 
        placeholder="Author" 
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <br/>
     <button onClick={handleSave}>
        {isEditing ? 'Update' : 'Add'}
      </button>

      <div>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author}
              <button onClick={() => editBook(book)}>Edit</button>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
