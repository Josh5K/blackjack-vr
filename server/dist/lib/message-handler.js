"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
var game_manager_1 = require("./game-manager");
var MessageHandler = /** @class */ (function () {
    function MessageHandler() {
    }
    MessageHandler.handleMessage = function (message, ws) {
        if (this.gm.players.find(function (x) { return x.id == ws.id; }) == undefined) {
            this.gm.CreatePlayer(ws);
        }
        switch (message.type) {
            case "hit":
                console.log(ws.id + " is hitting!");
                this.gm.playerHit(ws.id);
                break;
            case "stand":
                console.log(ws.id + " is standing!");
                this.gm.playerStand(ws.id);
                break;
            case "start":
                console.log(ws.id + " is starting a game!");
                this.gm.startGame();
                break;
            case "playerposition":
                this.gm.movePlayer(ws.id, message.value);
                break;
            case "joined":
                console.log("PlayerJoined");
                break;
            default:
                console.log("Unknown message!");
                console.log(message.type);
                break;
        }
    };
    MessageHandler.gm = new game_manager_1.GameManager();
    return MessageHandler;
}());
exports.MessageHandler = MessageHandler;
