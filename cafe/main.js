const { app, BrowserWindow, Menu, session, shell } = require('electron');
const path = require('path');

// ====== BURADA DƏYİŞDİRİN ======
const APP_URL = 'https://cafe.opos.az';           // Açılacaq sayt
const APP_TITLE = 'OPOS Restoran';       // Pəncərə başlığı
const ALLOWED_HOST = 'opos.az'; // İcazə verilən domen (bundan kənara keçidə icazə yoxdur)
// ================================

let mainWindow;

function isAllowedUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname === ALLOWED_HOST || u.hostname.endsWith('.' + ALLOWED_HOST);
  } catch (e) {
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: APP_TITLE,
    autoHideMenuBar: true,
    backgroundColor: '#111111',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });

  // Menyu tam gizlədilir (Alt düyməsi ilə də açılmasın deyə)
  Menu.setApplicationMenu(null);

  mainWindow.loadURL(APP_URL);

  // Sayt daxilində açılan linkləri də eyni pəncərədə saxlayır,
  // kənar linkləri isə default brauzerdə açır (sayt daxilindən çıxmasın deyə)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedUrl(url)) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Yüklənmə xətası olarsa sadə bir mesaj göstərib yenidən cəhd et
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    if (errorCode === -3) return; // aborted, adətən normal navigasiyadandır
    mainWindow.loadURL(
      'data:text/html;charset=utf-8,' +
        encodeURIComponent(`
        <html><body style="font-family:sans-serif;text-align:center;padding-top:100px;background:#111;color:#eee;">
          <h2>İnternet bağlantısı yoxdur və ya sayt açılmadı</h2>
          <p>${errorDescription}</p>
          <button onclick="location.reload()" style="padding:10px 20px;font-size:16px;">Yenidən cəhd et</button>
        </body></html>
      `)
    );
    setTimeout(() => {
      if (mainWindow) mainWindow.loadURL(APP_URL);
    }, 5000);
  });

  // Qısayollar: F11 tam ekran, F5/Ctrl+R yenilə, Alt+Sol geri
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    } else if (input.key === 'F5' || (input.control && input.key.toLowerCase() === 'r')) {
      mainWindow.reload();
    } else if (input.alt && input.key === 'ArrowLeft') {
      if (mainWindow.webContents.canGoBack()) mainWindow.webContents.goBack();
    }
  });
}

// Eyni anda yalnız bir nüsxə açıq olsun
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
