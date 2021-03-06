"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var StorageManager = require("./StorageManager");
var PreferenceManager_1 = require("./PreferenceManager");
var path = require("path");
var url = require("url");
var strings = require("./_core/res/strings");
var PREFERENCE = require("./_core/contract/_preferences");
var UpdateManager_1 = require("./UpdateManager");
var ipc_1 = require("./ipc");
var window;
var windowLoad;
var windowCrash;
// When app is ready to run
electron_1.app.on('ready', function () {
    createBaseWindowObjects().then(function () {
        createPreloader().catch();
        initializeStorageAndProcess()
            .then(initializeAppBridge)
            .then(createWindowApp)
            .catch(createWindowCrash);
    }).catch(function (e) {
        console.log(e);
        process.exit(1);
    });
});
function createBaseWindowObjects() {
    return new Promise(function (resolve, reject) {
        try {
            windowLoad = new electron_1.BrowserWindow({
                title: 'Loading',
                width: 600,
                height: 400,
                transparent: true,
                closable: false,
                frame: false,
                maximizable: false,
                minimizable: false,
                fullscreenable: false,
                skipTaskbar: true,
                titleBarStyle: 'hiddenInset',
                vibrancy: 'dark',
                show: false,
            });
            // Create a new window
            window = new electron_1.BrowserWindow({
                title: strings.APP_TITLE,
                width: PreferenceManager_1.default.get(PREFERENCE.WINDOW_WIDTH) || 800,
                height: PreferenceManager_1.default.get(PREFERENCE.WINDOW_HEIGHT) || 600,
                show: false
            });
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}
function createWindowApp() {
    UpdateManager_1.downloadFormUpdates().then(function (result) {
        console.log('done');
        console.log(result);
    }).catch(function (e) {
        console.log(e);
    });
    console.log('Storage initialized');
    window.once('ready-to-show', function () {
        window.show();
        windowLoad.hide();
    });
    // Determine what to load. React development server or production static files
    if (process.defaultApp) {
        console.log('Loading development server');
        window.loadURL('http://localhost:3000');
    }
    else {
        console.log('Loading production files');
        window.loadURL(url.format({
            pathname: path.join(__dirname, './react/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    // Handle close
    window.on('close', function () {
        console.log('shutting down');
        if (window) {
            window.setTitle('Dalmatian ICS' + //version +
                ' shutting down');
            // Persist width and height so they can be restored next time
            var bounds = window.getBounds();
            PreferenceManager_1.default.set(PREFERENCE.WINDOW_HEIGHT, bounds.height);
            PreferenceManager_1.default.set(PREFERENCE.WINDOW_WIDTH, bounds.width);
        }
    });
}
function initializeStorageAndProcess() {
    console.log('Application is running');
    // Initialize storage
    return StorageManager.initialize(electron_1.app.getPath('userData'));
}
function initializeAppBridge() {
    return new Promise(function (resolve, reject) {
        try {
            ipc_1.default(window);
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}
function createPreloader() {
    return new Promise(function (resolve, reject) {
        try {
            // create BrowserWindow with dynamic HTML content
            var loaderHtml = [
                '<head><style>',
                '*{ text-align:center; }',
                'h1{ color: seagreen;} ',
                'body{ margin:3%;} ',
                '.contents{background:whitesmoke; border-radius:2em; padding:1em;} ',
                '</style></head>',
                '<body><div class="contents">',
                '<h1>Dalmatian ICS</h1>',
                '<h2>Loading . . .</h2>',
                '</div></body>',
            ].join('');
            windowLoad.loadURL('data:text/html;charset=utf-8,' +
                encodeURI(loaderHtml));
            windowLoad.show();
            resolve();
        }
        catch (exc) {
            windowLoad.hide();
            console.log('error in loader', exc);
            reject(exc);
        }
    });
}
function createWindowCrash(e) {
    return new Promise(function (resolve, reject) {
        console.log(e);
        try {
            // create BrowserWindow with dynamic HTML content
            var html = [
                '<head><style>',
                '*{ text-align:center; }',
                'h1{ color: seagreen;} ',
                'pre{ word-wrap: break-word;} ',
                '.contents{background:whitesmoke; border-radius:2em; padding:1em;}',
                '</style></head>',
                '<body><div class="contents">',
                '<h1>Dalmatian ICS failed to start</h1>',
                '<h2>Error: ' + e.name + ' </h2>',
                '<p>' + e.message + ' </p>',
                process.defaultApp ? ('<pre>' + e.stack + ' </pre>') : '',
                '</div></body>',
            ].join('');
            windowCrash = new electron_1.BrowserWindow({
                title: 'Dalmatian ICS Crash',
                width: 800,
                height: 400,
                vibrancy: 'dark',
            });
            windowCrash.loadURL('data:text/html;charset=utf-8,' +
                encodeURI(html));
            window && window.destroy();
            windowLoad && windowLoad.destroy();
            resolve();
        }
        catch (exc) {
            windowCrash.hide();
            console.log('error in crash window display', exc);
            reject(exc);
        }
    });
}
