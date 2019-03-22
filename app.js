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

// When our app is ready, we'll create our BrowserWindow
app.on('ready', function() {
  // First we'll get our height and width. This will be the defaults if there wasn't anything saved
  let { width, height } = store.get('windowBounds');

  // Pass those values in to the BrowserWindow options
  mainWindow = new BrowserWindow({ width, height });

  mainWindow.loadFile(path.join('render', 'index.html'));

  mainWindow.once('show', () => {
      console.log("show some BOOOOOKS!")
      let books = bookStore.get('books')
      mainWindow.send('displayBook', books)
  });

  // delete book
  ipcMain.on('delete-book', (event, book) => {
    const updatedBooks = bookStore.delete(book)

    mainWindow.send('displayBook', updatedBooks)
  })

  // add book
  ipcMain.on('addBook', (event, book) => {
      bookStore.add('books', book)
      const updatedBooks = bookStore.get('books')
      mainWindow.send('displayBook', updatedBooks);
      mainWindow.loadURL('file://' + path.join(__dirname, 'views/index.html'));
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

  mainWindow.loadURL('file://' + path.join(__dirname, 'views/splash.html'));
  mainWindow.webContents.openDevTools()
});
