const { app, BrowserWindow } = require('electron');
const path = require('path');
const Store = require('./store.js');
const {ipcMain} = require('electron')
let mainWindow; //do this so that the window object doesn't get GC'd

// First instantiate the class
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 800, height: 600 }
  }
});

const bookStore = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'books',
  defaults: {
    books: []
  }
});

/*
const getBooks = () => {
    return JSON.parse(mainWindow.localStorage.getItem('books')) || []
}

const addBook = (book) => {
    const books = [ ...getBooks(), book ]

    mainWindow.localStorage.setItem('books', JSON.stringify(books))
    console.log(books)

    return books
}
*/

// When our app is ready, we'll create our BrowserWindow
app.on('ready', function() {
  // First we'll get our height and width. This will be the defaults if there wasn't anything saved
  let { width, height } = store.get('windowBounds');

  /*
  const book = {
      title: "stuff",
      author: 'guy'
  }
  bookStore.add(book)
  */

  // Pass those values in to the BrowserWindow options
  mainWindow = new BrowserWindow({ width, height });

  // add-todo from add todo window
  ipcMain.on('addBook', (event, book) => {
    const updatedBooks = bookStore.add(book)

    mainWindow.send('book_list', updatedBooks)
  })

  // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });

  mainWindow.loadURL('file://' + path.join(__dirname, 'views/index.html'));
  mainWindow.webContents.openDevTools()
});
