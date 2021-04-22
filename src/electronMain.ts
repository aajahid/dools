import { app, BrowserWindow, globalShortcut, screen } from 'electron';
import path from 'path';

function createAndReturnWindow () {
    let display = screen.getPrimaryDisplay();
    const win = new BrowserWindow({
        width:  500,
        height: 80,
        frame:  true,
        skipTaskbar: true,
        x: (display.size.width / 2) - 250,
        y: (display.size.height /2 ) - 400,
        webPreferences: {
            preload: path.join(__dirname, 'initialize.js'),
            nativeWindowOpen: true
        }
    })

    win.loadFile('index.html')
    return win;
}

app.whenReady().then(() => {
    const win = createAndReturnWindow()
    const ret = globalShortcut.register('CommandOrControl+Space', () => {
        if (win.isVisible())
            win.hide()
        else
            win.show();
    })


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createAndReturnWindow()
        }
    })
})

app.on('will-quit', () => {
    //globalShortcut.unregister('CommandOrControl+Space')
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})