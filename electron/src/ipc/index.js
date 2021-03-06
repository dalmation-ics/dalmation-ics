"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var archiveBridge_1 = require("./archiveBridge");
var IpcWrapper_1 = require("./IpcWrapper");
var electronBridge_1 = require("./electronBridge");
var stateBridge_1 = require("./stateBridge");
var formTemplateBridge_1 = require("./formTemplateBridge");
var IpcBridgeConfiguration = function (window) {
    var ipcW = new IpcWrapper_1.default(window);
    stateBridge_1.default(ipcW);
    formTemplateBridge_1.default(ipcW);
    archiveBridge_1.default(ipcW);
    electronBridge_1.default(ipcW);
};
exports.default = IpcBridgeConfiguration;
