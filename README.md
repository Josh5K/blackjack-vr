# Blackjack

This is a proof of concept to show what a game of blackjack could look like in Aframe. This service consists of 2 seperate applications.

* A express websocket server which is responsible for the game logic.
* A static html site that the client uses to interact with the websocket server.

## Goals

The purpose of this project was to take my experience with game dev server/client networking and explore what that looks like inside of a web application.

## Client Side vs Server Side

When creating multi user application you want to offload as much of the logic as you can to the server. This is because you can never trust the client to give you unmanipulated information. Personally when I try to decide where logic should go I ask myself two questions.

* If the data were manipulated would it negativly impact the purpose of the application.

If the answer is yes you should always handle this serverside. However if the answer is no I will then ask myself.

* Where will the client experience be smoother.

The answer to that question will determine where the logic lives.

## What is handled serverside?

* Giving a player new cards
* Tracking players card state.
* Calculating the players score
* Ending a players turn
* Notify players if they have won or lost.

## What is handled client side?

The client will send messages to the websocket server on what actions it wants to take. Client Side that looks like this.

```javascript
function SendStart() {
  websocket.send(JSON.stringify({"type": "start"}));
}


function SendStand() {
  websocket.send(JSON.stringify({"type": "stand"}));
}


function SendHit() {
  websocket.send(JSON.stringify({"type": "hit"}));
}
```

The client will then recieve updates from the server on the state of the game. The client will then use that state to update what the user sees.

The client will also tell the server where their player model is standing. In a lot of scenarios this should be handled on the server. However for our case here the players position does not matter to how the game plays out.

## What does an update look like?

An update consists of 3 parts. UpdateType, a playerID and a value.

```typescript
export enum UpdateType {
  Players = "Players",
  HiddenCard = "HiddenCard",
  Client = "Client",
  Dealer = "Dealer",
  Win = "Win",
  GameStarting = "GameStarting",
  PlayerPosition = "PlayerPosition"
}

export class Update {
  type: UpdateType;
  playerID: string;
  value: any;

  constructor(type:UpdateType, playerID:string, value:any) {
    this.playerID = playerID;
    this.type = type;
    this.value = value;
  }
}
```

## If time wasn't a factor what would I add?

There are a lot of ideas I have for a completed version of this game. However the scope of the project is a proof of concept. To allow myself to reach a completed proof of concept state they were left out.

* User management - Currently there is no user management if a user disconnects from the websocket we forget about them and treat them as a new user if they were to reconnect.
* State management - Storing long term data could allow us to create features such as user statistics, high scores etc..
* Player Balance - Allow players to bet in game currency on their rounds.
* Lobby/room system - Allows players to load in to seperate rooms and have multiple games going at once.
* Improve player models
* Card Animations
* Fix game rules to be more aligned with blackjack
* Add game state to HUD
* Server Side movement w/ Client Side predictions


## What could I of done better?

Everytime I build an app I look back at what I could of done better. Here is no different

* Seperate the GameManager into a ServerManager and GameManager.
* Use a more abstract websocket library like socket.io
* Serve the static files from the express server.
* Migrate more of the client side logic to custom Aframe components.

## Known Bugs

Bugs in software? :astonished:

* If a player disconnects their model is not removed from the clients state.
* Score will sometimes be miscalculated if user has 2 aces
* Client will attempt to send positon messages to websocket before connection is upgraded.
