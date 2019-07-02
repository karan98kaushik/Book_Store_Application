class Book {
    constructor (title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        // Create tr element
        const row = document.createElement('tr');
        // Insert Cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    claearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners
document.getElementById('book-form').addEventListener('submit', function(e){
    
    // Get Form Values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    // Instantiate the Book
    const book = new Book(title, author, isbn);

    // Instantiate the UI
    const ui = new UI();

    // Validate Form
    if(title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill all the Fields!', 'error');
    }else {
        // Add Book to List
        ui.addBookToList(book);

        // Add to LS
        Store.addBook(book);

        ui.showAlert('Book Added!', 'success');

        // UI Clear Fields
        ui.clearFields();

    }

    e.preventDefault();
}); 

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', function(e){

    const ui = new UI();

    ui.deleteBook(e.target);

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
});