class Book {
    constructor(id, title, author, isbn, year, tags, category) {
        this.id = id || Date.now(); 
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.year = year;
        this.tags = tags.split(',').map(tag => tag.trim());
        this.category = category;
        this.rating = rating; 
    }
}

class BookManager {
    constructor() {
        this.books = JSON.parse(localStorage.getItem('books')) || [];
        this.categoryChartInstance = null; 
        this.yearChartInstance = null; 
        this.initEventListeners();
        this.displayBooks(this.books);
        this.updateCharts();
    }

    initEventListeners() {
        document.getElementById('book-form').addEventListener('submit', (e) => this.addBook(e));
        document.getElementById('search').addEventListener('input', (e) => this.searchBooks(e));
        document.getElementById('category-filter').addEventListener('change', (e) => this.filterBooksByCategory(e));
    }

    addBook(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        const year = document.getElementById('year').value;
        const tags = document.getElementById('tags').value;
        const category = document.getElementById('book-category').value;
        const rating = document.getElementById('rating').value;
        const id = document.getElementById('book-id').value;

        if (!title || !author || !isbn || !year || !category|| !rating) {
            alert('Please fill out all required fields.');
            return;
        }

        if (id) {
            // Editing an existing book
            const bookIndex = this.books.findIndex(book => book.id === parseInt(id));
            if (bookIndex !== -1) {
                this.books[bookIndex] = new Book(id, title, author, isbn, year, tags, category, rating);
            }
        } else {
            // Adding a new book
            const newBook = new Book(null, title, author, isbn, year, tags, category, rating);
            this.books.push(newBook);
        }

        localStorage.setItem('books', JSON.stringify(this.books));
        this.displayBooks(this.books);
        this.updateCharts();
        this.resetForm();
    }

    resetForm() {
        document.getElementById('book-form').reset();
        document.getElementById('book-id').value = '';
    }

    deleteBook(id) {
        this.books = this.books.filter(book => book.id !== id);
        localStorage.setItem('books', JSON.stringify(this.books));
        this.displayBooks(this.books);
        this.updateCharts();
    }

    editBook(id) {
        const book = this.books.find(book => book.id === id);
        if (book) {
            document.getElementById('book-id').value = book.id;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('isbn').value = book.isbn;
            document.getElementById('year').value = book.year;
            document.getElementById('tags').value = book.tags.join(', ');
            document.getElementById('book-category').value = book.category;
            document.getElementById('rating').value = book.rating;
        }
    }

    displayBooks(books) {
        const bookTableBody = document.getElementById('book-table-body');
        bookTableBody.innerHTML = '';
        books.forEach(book => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td data-label="Title">${book.title}</td>
                <td data-label="Author">${book.author}</td>
                <td data-label="ISBN">${book.isbn}</td>
                <td data-label="Year">${book.year}</td>
                <td data-label="Category">${book.category}</td>
                <td data-label="Tags">${book.tags.join(', ')}</td>
                <td data-label="Rating">${book.rating}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                </td>
                <td>
                  <button class="delete-btn">Delete</button>
                </td>
            `;

            // Attach event listeners to the buttons
            row.querySelector('.edit-btn').addEventListener('click', () => this.editBook(book.id));
            row.querySelector('.delete-btn').addEventListener('click', () => this.deleteBook(book.id));

            bookTableBody.appendChild(row);
        });
    }

    searchBooks(e) {
        const query = e.target.value.toLowerCase();
        const filteredBooks = this.books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.isbn.toLowerCase().includes(query)
        );
        this.displayBooks(filteredBooks);
    }

    filterBooksByCategory(e) {
        const category = e.target.value;
        const filteredBooks = category === 'all'
            ? this.books
            : this.books.filter(book => book.category === category);
        this.displayBooks(filteredBooks);
    }
    sortBooksByRating() {
        this.books.sort((a, b) => b.rating - a.rating);
        this.displayBooks(this.books);
    }    

    updateCharts() {
        const categories = this.books.reduce((acc, book) => {
            acc[book.category] = (acc[book.category] || 0) + 1;
            return acc;
        }, {});

        const years = this.books.reduce((acc, book) => {
            acc[book.year] = (acc[book.year] || 0) + 1;
            return acc;
        }, {});

        this.renderChart('categoryChart', 'Books per Category', categories, this.categoryChartInstance);
        this.renderChart('yearChart', 'Books per Publication Year', years, this.yearChartInstance);
    }

    renderChart(elementId, label, data, chartInstance) {
        const ctx = document.getElementById(elementId).getContext('2d');

        // Destroy the existing chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create a new chart instance and store it in the variable
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: label,
                    data: Object.values(data),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return chartInstance;
    }
    }


const bookManager = new BookManager();
