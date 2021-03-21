"use strict";
var Deck = /** @class */ (function () {
    function Deck() {
        var _this = this;
        this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.suits = ['C', 'H', 'S', 'D'];
        this.deck = [];
        this.suits.forEach(function (suit) {
            _this.values.forEach(function (value) {
                _this.deck.push(new Card(value, suit));
            });
        });
    }
    Deck.prototype.deal = function () {
        this.deck.shift();
    };
    Deck.prototype.toString = function () {
        return '[' + this.deck.join(', ') + ']';
    };
    return Deck;
}());
var Card = /** @class */ (function () {
    function Card(value, suit) {
        this.value = value;
        this.suit = suit;
    }
    Card.prototype.toString = function () {
        return this.value + " of " + this.suit + "s";
    };
    Card.prototype.getNumericValue = function (aceValue) {
        var _this = this;
        if (aceValue === void 0) { aceValue = 11; }
        if (['J', 'Q', 'K'].find(function (x) { return x === _this.value; })) {
            return 10;
        }
        else if (this.value == 'A') {
            return aceValue;
        }
        return parseInt(this.value);
    };
    return Card;
}());
var Player = /** @class */ (function () {
    function Player(id, name) {
        this.id = id;
    }
    return Player;
}());
