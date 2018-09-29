"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("../../_core/error");
var stateBridge_1 = require("../../_core/contract/ipc/stateBridge");
var storage_1 = require("../../storage");
exports.default = (function (ipcW) {
    /**
     * Prompt react for state when window is closing
     * Then save state
     * //TODO There has to be a more logical place for this
     */
    ipcW.window.once('close', function (e) {
        console.log('preventing event');
        e.preventDefault();
        console.log('sending IPC save req');
        ipcW.prompt(stateBridge_1.ACT_SAVE_STATE, function (err, result) {
            console.log('IPC save recieved');
            var size = ipcW.window.getSize();
            result.window = {
                width: size[0],
                height: size[1],
            };
            console.log('Window data saved');
            console.log('Firing state save');
            storage_1.stateManager.save(result).then(function () {
                console.log('State Saved');
                ipcW.window.close();
                process.exit(0);
            }).catch(function (e) {
                console.log(e);
                process.exit(1);
            });
        });
    });
    /**
     * Listen for LOAD_STATE
     */
    ipcW.registerSync(stateBridge_1.ACT_LOAD_STATE, function (callback) {
        storage_1.stateManager.load().then(function (result) {
            result.window = undefined;
            callback(null, result);
        }).catch(function (e) {
            if (e instanceof error_1.FileNotFoundError)
                callback(null, false);
            else
                callback(e);
        });
    });
    /**
     * Listen for APP_VERSION
     */
    ipcW.registerSync(stateBridge_1.ACT_APP_VERSION, function (callback) {
        callback(null, storage_1.stateManager.appVersion());
    });
});
