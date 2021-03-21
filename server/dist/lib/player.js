"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var card_1 = require("./card");
var Player = /** @class */ (function () {
    function Player(id, ws) {
        this.id = id;
        this.cards = [];
        this.hiddenCard = new card_1.Card('0', '0');
        this.ws = ws;
        this.standing = false;
        this.positionX = 0;
        this.positionZ = 0;
    }
    Player.prototype.cardsValue = function () {
        var score = 0;
        var cards = this.cards;
        cards.forEach(function (card) {
            score += card.getNumericValue();
        });
        score += this.hiddenCard.getNumericValue();
        if (score > 21) {
            score = 0;
            cards.forEach(function (card) {
                score += card.getNumericValue(1);
            });
            score += this.hiddenCard.getNumericValue(1);
        }
        return score;
    };
    Player.prototype.isBusted = function () {
        return this.cardsValue() > 21;
    };
    return Player;
}());
exports.Player = Player;
