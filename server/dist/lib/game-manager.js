"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
var __1 = require("..");
var deck_1 = require("./deck");
var player_1 = require("./player");
var utility_1 = require("./utility");
var update_1 = require("./update");
var GameManager = /** @class */ (function () {
    function GameManager() {
        this.players = [];
        this.dealer = new player_1.Player("dealer", null);
        this.deck = new deck_1.Deck();
        this.playerMoveSpeed = .5;
    }
    GameManager.prototype.CreatePlayer = function (ws) {
        console.log("Creating Player");
        var player = new player_1.Player(ws.id, ws);
        this.players.push(player);
    };
    GameManager.prototype.DeletePlayer = function (id) {
        console.log("Deleting Player");
        var playerIndex = this.players.findIndex(function (x) { return x.id == id; });
        this.players.splice(playerIndex, 1);
    };
    GameManager.prototype.startGame = function () {
        var _this = this;
        var gameStarting = new update_1.Update(update_1.UpdateType.GameStarting, "", "");
        __1.wss.broadcast(JSON.stringify(gameStarting));
        this.players.forEach(function (player) {
            player.cards = [];
            player.standing = false;
        });
        this.deck = new deck_1.Deck();
        this.players.forEach(function (player) {
            player.hiddenCard = _this.deck.deal();
            player.cards.push(_this.deck.deal());
        });
        this.dealer = new player_1.Player("dealer", null);
        this.dealer.hiddenCard = this.deck.deal();
        this.dealer.cards.push(this.deck.deal());
        var dealerUpdate = new update_1.Update(update_1.UpdateType.Dealer, this.dealer.id, this.dealer);
        __1.wss.broadcast(JSON.stringify(dealerUpdate, utility_1.replacer));
        var playersUpdate = new update_1.Update(update_1.UpdateType.Players, '', this.players);
        __1.wss.broadcast(JSON.stringify(playersUpdate, utility_1.replacer));
        this.players.forEach(function (player) {
            var hiddenCardUpdate = new update_1.Update(update_1.UpdateType.HiddenCard, player.id, player.hiddenCard);
            player.ws.send(JSON.stringify(hiddenCardUpdate));
        });
    };
    GameManager.prototype.playerHit = function (playerID) {
        if (playerID == "dealer") {
            this.dealer.cards.push(this.deck.deal());
        }
        else {
            var player = this.players.find(function (x) { return x.id === playerID; });
            if (!player.standing) {
                player.cards.push(this.deck.deal());
                var playerUpdate = new update_1.Update(update_1.UpdateType.Players, player.id, player);
                __1.wss.broadcast(JSON.stringify(playerUpdate, utility_1.replacer));
            }
        }
    };
    GameManager.prototype.playerStand = function (playerID) {
        var player = this.players.find(function (x) { return x.id === playerID; });
        if (player.standing) {
            console.log("Player " + player.id + " already standing.");
        }
        else {
            player.standing = true;
        }
        var allStanding = true;
        this.players.forEach(function (player) {
            if (!player.standing) {
                allStanding = false;
            }
        });
        if (allStanding) {
            this.endGame();
        }
    };
    GameManager.prototype.endGame = function () {
        var _this = this;
        var hiddenCardUpdate = new update_1.Update(update_1.UpdateType.HiddenCard, this.dealer.id, this.dealer.hiddenCard);
        __1.wss.broadcast(JSON.stringify(hiddenCardUpdate));
        while (this.dealer.cardsValue() < 17) {
            this.playerHit(this.dealer.id);
        }
        var dealerUpdate = new update_1.Update(update_1.UpdateType.Dealer, this.dealer.id, this.dealer);
        __1.wss.broadcast(JSON.stringify(dealerUpdate, utility_1.replacer));
        this.players.forEach(function (player) {
            var playerHiddenUpdate = new update_1.Update(update_1.UpdateType.HiddenCard, player.id, player.hiddenCard);
            __1.wss.broadcast(JSON.stringify(playerHiddenUpdate));
            var winnerUpdate = new update_1.Update(update_1.UpdateType.Win, player.id, "You Win!");
            var drawUpdate = new update_1.Update(update_1.UpdateType.Win, player.id, "It's a Draw!");
            var looseUpdate = new update_1.Update(update_1.UpdateType.Win, player.id, "You Lose!");
            if (!player.isBusted()) {
                if (_this.dealer.isBusted()) {
                    player.ws.send(JSON.stringify(winnerUpdate));
                }
                else if (player.cardsValue() == _this.dealer.cardsValue()) {
                    player.ws.send(JSON.stringify(drawUpdate));
                }
                else if (player.cardsValue() > _this.dealer.cardsValue()) {
                    player.ws.send(JSON.stringify(winnerUpdate));
                }
                else {
                    player.ws.send(JSON.stringify(looseUpdate));
                }
            }
            else {
                player.ws.send(JSON.stringify(looseUpdate));
            }
        });
    };
    GameManager.prototype.movePlayer = function (clientID, value) {
        var playerPositionUpdate = new update_1.Update(update_1.UpdateType.PlayerPosition, clientID, value);
        __1.wss.broadcast(JSON.stringify(playerPositionUpdate));
    };
    return GameManager;
}());
exports.GameManager = GameManager;
