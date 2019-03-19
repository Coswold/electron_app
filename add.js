'use strict'

const { ipcRenderer } = require('electron')

document.getElementById('bookForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  console.log('Submit form!!!!!!')

  console.log(evt.target[1].value)

  // input on the form
  const input = {
      'title': evt.target[0].value,
      'author': evt.target[1].value,
      'genre': evt.target[2].value,
      'owned': evt.target[3].value,
      'url': evt.target[5].value,
  }

  // send book to main process
  ipcRenderer.send('addBook', input)

  // reset input
  input.value = ''
})
