const { app, Tray } = require('electron');
const path = require('path');
const Store = require('./store.js');
const {ipcMain} = require('electron');
const Window = require('./Window');
let mainWindow; //do this so that the window object doesn't get GC'd
require('electron-reload')(__dirname);

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
    configName: 'books',
    defaults: {
        books: []
    }
});

let books = []

// When our app is ready, we'll create our BrowserWindow
app.on('ready', function() {
    // First we'll get our height and width. This will be the defaults if there wasn't anything saved
    let { width, height } = store.get('windowBounds');
    const appIcon = new Tray('images/logo.png');

    mainWindow = new Window({
        file: path.join('views', 'index.html'),
        windowSettings: { width, height },
        icon: 'images/logo.png'
    });

    mainWindow.on('show', () => {
        books = bookStore.get('books');
        mainWindow.webContents.send('displayBook', books);
    });

    // delete book
    ipcMain.on('changePage', (event, file) => {
        books = bookStore.get('books');
        mainWindow.webContents.send('displayBook', books);
        mainWindow.loadURL('file://' + path.join(__dirname, 'views/' + file + '.html'));
    })

    // delete book
    ipcMain.on('deleteBook', (event, book) => {
        const updatedBooks = bookStore.delete(book);

        mainWindow.webContents.send('displayBook', updatedBooks);
        mainWindow.loadURL('file://' + path.join(__dirname, 'views/index.html'));
    })

    // add book
    ipcMain.on('addBook', (event, book) => {
        bookStore.add('books', book);
        const updatedBooks = bookStore.get('books');
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

    mainWindow.loadURL('file://' + path.join(__dirname, 'views/index.html'));
});
