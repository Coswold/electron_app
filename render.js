'use strict'

const { ipcRenderer } = require('electron');

// delete todo by its text value ( used below in event listener)
const deleteBook = (e) => {
  ipcRenderer.send('delete-book', e.target.textContent)
}

// on receive todos
ipcRenderer.on('displayBook', (event, books) => {
    console.log("render books" + books)
    // get the todoList ul
    const bookList = document.getElementById('bookList')
    console.log("html: " + bookList)

    // create html string
    const bookItems = books.reduce((html, book) => {
        html += `<li class="book-item">${book}</li>`

        return html
    }, '');

    // set list html to the todo items
    bookList.innerHTML = bookItems

    // add click handlers to delete the clicked todo
    bookList.querySelectorAll('.book-item').forEach(item => {
        item.addEventListener('click', deleteBook)
    })
})
