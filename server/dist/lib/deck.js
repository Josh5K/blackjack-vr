"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
var card_1 = require("./card");
var Deck = /** @class */ (function () {
    function Deck() {
        var _this = this;
        this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.suits = ['C', 'H', 'S', 'D'];
        this.cards = [];
        this.suits.forEach(function (suit) {
            _this.values.forEach(function (value) {
                _this.cards.push(new card_1.Card(value, suit));
            });
        });
        this.shuffle();
    }
    Deck.prototype.deal = function () {
        if (this.cards) {
            return this.cards.shift();
        }
    };
    Deck.prototype.toString = function () {
        return '[' + this.cards.join(', ') + ']';
    };
    Deck.prototype.shuffle = function () {
        var currentIndex = this.cards.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temporaryValue;
        }
        return this.cards;
    };
    return Deck;
}());
exports.Deck = Deck;
