"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
var message_handler_1 = require("./lib/message-handler");
var update_1 = require("./lib/update");
var utility_1 = require("./lib/utility");
var express = require('express');
var ws = require('ws');
var app = express();
var maxPlayers = 3;
exports.wss = new ws.Server({ noServer: true });
exports.wss.on('connection', function (ws) {
    if (exports.wss.clients.size > maxPlayers) {
        ws.send(JSON.stringify({ "type": "ServerFull", "value": "Server Full!" }));
        ws.terminate();
    }
    ws.id = exports.wss.getUniqueID();
    ws.isAlive = true;
    var clientUpdate = new update_1.Update(update_1.UpdateType.Client, ws.id, { "id": ws.id });
    ws.send(JSON.stringify(clientUpdate, utility_1.replaceWs));
    ws.on('message', function (message) {
        message_handler_1.MessageHandler.handleMessage(JSON.parse(message), ws);
    });
    ws.on('close', function () {
        message_handler_1.MessageHandler.gm.DeletePlayer(ws.id);
        console.log("Client " + ws.id + " disconnected!");
    });
    ws.on('pong', function () {
        ws.isAlive = true;
    });
    setInterval(function () {
        if (ws.isAlive === false)
            return ws.terminate();
        ws.isAlive = false;
        ws.ping(function () { });
    }, 5000);
});
exports.wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};
exports.wss.broadcast = function broadcast(msg) {
    exports.wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};
var server = app.listen(3000);
server.on('upgrade', function (request, socket, head) {
    exports.wss.handleUpgrade(request, socket, head, function (socket) {
        exports.wss.emit('connection', socket, request);
    });
});
