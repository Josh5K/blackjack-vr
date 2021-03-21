"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceWs = exports.replacer = void 0;
function replacer(key, value) {
    if (key == "hiddenCard")
        return undefined;
    else if (key == "ws")
        return undefined;
    else
        return value;
}
exports.replacer = replacer;
function replaceWs(key, value) {
    if (key == "ws")
        return undefined;
    else
        return value;
}
exports.replaceWs = replaceWs;
