const Store = require('./store.js');

const bookStore = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'books',
  defaults: {
    books: []
  }
});

let books = bookStore.get('books');

const bL = document.getElementById('bookList')

const bookItems = ``
// create html string
for (i = 0; i < books.length; i++) {
    bookItems += `<li class="todo-item">${books[i]}</li>`
}

// set list html to the todo items
bL.innerHTML = bookItems
