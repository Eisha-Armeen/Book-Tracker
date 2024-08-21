// Book Class Definition
class Book {
    constructor(title, author, isbn, year, tags, category) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.year = year;
        this.tags = tags.split(',').map(tag => tag.trim());
        this.category = category;
    }
}

// Array to store books (loaded from localStorage if available)
let books = JSON.parse(localStorage.getItem('books')) || [];

// Function to save books to localStorage
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

// Function to display books in the book list
function displayBooks(filteredBooks = books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear previous list

    filteredBooks.forEach((book, index) => {
        const bookItem = document.createElement('li');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <strong>${book.title}</strong> by ${book.author} (ISBN: ${book.isbn}, Year: ${book.year}, Tags: ${book.tags.join(', ')}, Category: ${book.category})
            <button onclick="editBook(${index})">Edit</button>
            <button onclick="deleteBook(${index})">Delete</button>`;
        bookList.appendChild(bookItem);
    });

    // Update the book statistics
    updateBookStats();
}

// Function to add a new book
function addBook(book) {
    books.push(book);
    saveBooks();
    displayBooks();
}

// Function to edit an existing book
function editBook(index) {
    const book = books[index];
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('year').value = book.year;
    document.getElementById('tags').value = book.tags.join(', ');
    document.getElementById('book-category').value = book.category;
    document.getElementById('book-id').value = index;
}

// Function to update a book after editing
function updateBook(index, updatedBook) {
    books[index] = updatedBook;
    saveBooks();
    displayBooks();
}

// Function to delete a book
function deleteBook(index) {
    books.splice(index, 1);
    saveBooks();
    displayBooks();
}

// Function to handle form submission (add or update book)
document.getElementById('book-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    const year = document.getElementById('year').value;
    const tags = document.getElementById('tags').value;
    const category = document.getElementById('book-category').value;
    const bookId = document.getElementById('book-id').value;

    if (title && author && isbn && year && category) {
        const newBook = new Book(title, author, isbn, year, tags, category);
        
        if (bookId === '') {
            addBook(newBook);
        } else {
            updateBook(bookId, newBook);
        }

        // Clear the form
        document.getElementById('book-form').reset();
        document.getElementById('book-id').value = '';
    } else {
        alert("Please fill out all required fields.");
    }
});

// Function to search books by title, author, or ISBN
document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query)
    );
    displayBooks(filteredBooks);
});

// Function to filter books by category
document.getElementById('category-filter').addEventListener('change', function() {
    const selectedCategory = this.value;
    const filteredBooks = selectedCategory === 'all' ? books : books.filter(book => book.category === selectedCategory);
    displayBooks(filteredBooks);
});

// Function to update book statistics
function updateBookStats() {
    const categoryCounts = books.reduce((acc, book) => {
        acc[book.category] = (acc[book.category] || 0) + 1;
        return acc;
    }, {});

    const yearCounts = books.reduce((acc, book) => {
        acc[book.year] = (acc[book.year] || 0) + 1;
        return acc;
    }, {});

    renderChart('categoryChart', 'Books per Category', categoryCounts);
    renderChart('yearChart', 'Books per Publication Year', yearCounts);
}

// Function to render chart (simple bar chart)
function renderChart(canvasId, chartTitle, data) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / labels.length;
    const maxVal = Math.max(...values);
    const scaleY = canvas.height / maxVal;

    values.forEach((value, index) => {
        const x = index * barWidth;
        const y = canvas.height - value * scaleY;
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(x, y, barWidth - 10, value * scaleY);
        ctx.fillStyle = "#000";
        ctx.fillText(labels[index], x + 10, canvas.height - 5);
    });

    ctx.fillText(chartTitle, 10, 20);
}

// Initial display of books on page load
document.addEventListener('DOMContentLoaded', displayBooks);
