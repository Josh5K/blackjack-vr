"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
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
exports.Card = Card;
