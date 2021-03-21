"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = exports.UpdateType = void 0;
var UpdateType;
(function (UpdateType) {
    UpdateType["Players"] = "Players";
    UpdateType["HiddenCard"] = "HiddenCard";
    UpdateType["Client"] = "Client";
    UpdateType["Dealer"] = "Dealer";
    UpdateType["Win"] = "Win";
    UpdateType["GameStarting"] = "GameStarting";
    UpdateType["PlayerPosition"] = "PlayerPosition";
})(UpdateType = exports.UpdateType || (exports.UpdateType = {}));
var Update = /** @class */ (function () {
    function Update(type, playerID, value) {
        this.playerID = playerID;
        this.type = type;
        this.value = value;
    }
    return Update;
}());
exports.Update = Update;
