//const wsUri = "wss://blackjack.creatorsclub.net/ws";
const wsUri = "ws://127.0.0.1:3000/ws";
const scene = document.querySelector("a-scene");
var playerPositions;
var dealerPositions;
var players = []
var client;
var dealer;

function init() {
  output = document.getElementById("output");
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
  setPlayerPositions()
}

function onOpen(evt) {
  console.log("CONNECTED");
  document.getElementById('camera').addEventListener('positionChanged', e => {
    websocket.send(JSON.stringify({"type": "playerposition", "value": e.detail}))
  });
  SendJoin()
}

function onClose(evt) {
  console.log("DISCONNECTED");
}

function onMessage(evt) {
  data = JSON.parse(evt.data);
  handleMessage(data)
}

function setPlayerPositions() {
  playerPositions = [
    {"startY": -.5, "startX": -2.5, "startZ": -2.8, "offsetY": 0, "offsetX": 0.9, "offsetZ": 0, "scorePos": "2.3 -.5 -1.9", "rotation": "-90 0 0"},
    {"startY": -.5, "startX": -7.0, "startZ": -13.2, "offsetY": 0, "offsetX": 0, "offsetZ": .9, "scorePos": "-7.8 -.5 -8.5", "rotation": "-90 -90 0"},
    {"startY": -.5, "startX": 6.5, "startZ": -6.2, "offsetY": 0, "offsetX": 0, "offsetZ": -.9, "scorePos": "7.5 -.5 -10.8", "rotation": "-90 0 90"},
  ]
  dealerPositions = {
    "startY": -.5, "startX": -2.1, "startZ": -16.5, "offsetY": 0, "offsetX": .9, "offsetZ": 0, "scorePos": "6.5 -.5 -8"
  }
}

function handleMessage(message) {
  switch (message.type) {
    case "Players":
      UpdatePlayers(message);
      break;
    case "HiddenCard":
      UpdateHiddenCard(message)
      break;
    case "Client":
      UpdateClient(message);
      break;
    case "Dealer":
      UpdateDealer(message);
      break;
    case "Win":
      EndGame(message);
      break;
    case "ServerFull":
      alert(message.value)
      break;
    case "GameStarting":
      GameStarting();
    case "PlayerPosition":
      updatePlayerPositon(message)
      break;
    case "Disconnect":
      removePlayerModel(message.value)
      break;
    default:
      break;
  }
}

function EndGame(message) {
  let gameEndText = document.createElement('a-text')
  gameEndText.setAttribute('position', '-2 -.5 -10')
  gameEndText.setAttribute('scale', '5 5 5')
  gameEndText.setAttribute('rotation', '-90 0 0')
  gameEndText.setAttribute('class', 'game-end-text')
  gameEndText.setAttribute('value', message.value)
  scene.appendChild(gameEndText);
}

function UpdatePlayers(message) {
  if(message.playerID) {
    let playerIndex = players.findIndex(x => x.id == message.playerID);
    players[playerIndex].cards = message.value.cards;
    players[playerIndex].standing = message.value.standing;
  }
  else {
    if(players.length > 0) {
      message.value.forEach(updatedPlayer => {
        let player = players.find(x => x.id == updatedPlayer.id)
        player.cards = updatedPlayer.cards
        player.standing = updatedPlayer.standing
      })
    }
    else {
      players = message.value
    }
  }
  UpdateGameState();
}

function UpdateGameState() {
  players.forEach(player => {
    let playerPos = playerPositions[players.findIndex(x => x.id == player.id)]
    let playerObject
    let playerHidden

    if(document.getElementById(player.id)) {
      playerObject = document.getElementById(player.id)
    }
    else {
      playerObject = document.createElement('a-entity')
      playerObject.setAttribute("id", player.id)
      playerObject.setAttribute("class", "player")

      let playerScore = document.createElement('a-entity')
      playerScore.setAttribute("id", `player-score-${player.id}`);
      playerScore.setAttribute("text", `value: ${client.id == player.id ? 'You' : 'Score'}: ${getCardsScore(player.cards, player.hiddenCard)}`)
      playerScore.setAttribute("scale", "10 10 10");
      playerScore.setAttribute("position", playerPos.scorePos)
      playerScore.setAttribute("rotation", playerPos.rotation)
      playerObject.appendChild(playerScore)

      playerHidden = document.createElement('a-plane')
      playerHidden.setAttribute("id", `player-hidden-${player.id}-hc`)
      playerHidden.setAttribute("class", "card")
      playerHidden.setAttribute("src", `assets/cardback.jpg`)
      playerHidden.setAttribute("height", "1")
      playerHidden.setAttribute("position", `${playerPos.startX} ${playerPos.startY} ${playerPos.startZ}`)
      playerHidden.setAttribute("rotation", playerPos.rotation)
      playerHidden.setAttribute("width", ".75")

      playerPos.startY += playerPos.offsetY
      playerPos.startX += playerPos.offsetX
      playerPos.startZ += playerPos.offsetZ

      playerObject.appendChild(playerHidden)
      scene.appendChild(playerObject)
    }

    if(player.hiddenCard) {
      if(playerHidden) {
        playerHidden.setAttribute("src", `assets/${player.hiddenCard.value}${player.hiddenCard.suit}.png`)
      }
      else {

        document.getElementById(`player-hidden-${player.id}-hc`).setAttribute("src", `assets/${player.hiddenCard.value}${player.hiddenCard.suit}.png`)
      }
    }
    document.getElementById(`player-score-${player.id}`).setAttribute("text", `value: ${client.id == player.id ? 'You' : 'Score'}: ${getCardsScore(player.cards, player.hiddenCard)}`)

    player.cards.forEach(card => {
      if(!document.getElementById(`player-visable-${player.id}-${card.value}${card.suit}`)) {

        let newCard = document.createElement('a-plane')
        newCard.setAttribute("id", `player-visable-${player.id}-${card.value}${card.suit}`)
        newCard.setAttribute("class", "card")
        newCard.setAttribute("src", `assets/${card.value}${card.suit}.png`)
        newCard.setAttribute("height", "1")
        newCard.setAttribute("position", `${playerPos.startX} ${playerPos.startY} ${playerPos.startZ}`)
        newCard.setAttribute("rotation", playerPos.rotation)
        newCard.setAttribute("width", ".75")
        document.getElementById(player.id).appendChild(newCard)

        playerPos.startY += playerPos.offsetY
        playerPos.startX += playerPos.offsetX
        playerPos.startZ += playerPos.offsetZ
      }
    });
  });
}

function UpdateHiddenCard(message) {
  if(message.playerID == "dealer") {
    dealer.hiddenCard = message.value
    if(dealer.hiddenCard) {
      document.getElementById("dealer-hidden").setAttribute("src", `assets/${dealer.hiddenCard.value}${dealer.hiddenCard.suit}.png`)
    }
  }
  else {
    let player = players.find(x => x.id == message.playerID)
    player.hiddenCard = {}
    player.hiddenCard.suit = message.value.suit
    player.hiddenCard.value = message.value.value
    UpdateGameState();
  }
}

function UpdateClient(message) {
  if(client == undefined) {
    client = message.value;
  }
}

function UpdateDealer(message) {
  if(dealer == undefined) {
    dealer = message.value;
    document.getElementById("dealer-hidden").setAttribute("src", "#cardback")
  }
  else {
    dealer.cards = message.value.cards
  }

  if(dealer.hiddenCard) {
    document.getElementById("dealer-hidden").setAttribute("src", `assets/${dealer.hiddenCard.value}${dealer.hiddenCard.suit}.png`)
  }
  dealer.cards.forEach(card => {
    if(!document.getElementById(`dealer-visable-${card.value}${card.suit}`)) {
      let newCard = document.createElement('a-plane')
      newCard.setAttribute("id", `dealer-visable-${card.value}${card.suit}`)
      newCard.setAttribute("class", "card")
      newCard.setAttribute("src", `assets/${card.value}${card.suit}.png`)
      newCard.setAttribute("height", "1")
      newCard.setAttribute("position", `${dealerPositions.startX} ${dealerPositions.startY} ${dealerPositions.startZ}`)
      newCard.setAttribute("rotation", "-90 0 0")
      newCard.setAttribute("width", ".75")
      scene.appendChild(newCard)

      dealerPositions.startY += dealerPositions.offsetY
      dealerPositions.startX += dealerPositions.offsetX
      dealerPositions.startZ += dealerPositions.offsetZ
    }
  });
  document.getElementById("dealer-score").setAttribute("text", `value: Dealer: ${getCardsScore(dealer.cards, dealer.hiddenCard)}`)
}

function getCardsScore(cards, hiddenCard="") {
  let score = 0;

  cards.forEach(card => {
    score += getNumericValue(card);
  });

  if(hiddenCard != "") {
    score += getNumericValue(hiddenCard)
  }

  if(score > 21) {
    cards.forEach(card => {
      if(card.value =='A' && score > 21) {
        score -= 10;
      }
    });
  }

  return score
}

function getNumericValue(card, aceValue = 11) {
  if(['J', 'Q', 'K'].includes(card.value)) {
    return 10;
  }
  else if(card.value == 'A') {
    return aceValue
  }
  return parseInt(card.value)
}

function GameStarting() {
  players = []
  dealer = undefined

  setPlayerPositions()

  let text = document.getElementsByClassName("game-end-text")
  while(text.length > 0) {
    text[0].parentNode.removeChild(text[0]);
  }

  let cards = document.getElementsByClassName("card")
  while(cards.length > 0) {
    cards[0].parentNode.removeChild(cards[0]);
  }

  let playerObjects = document.getElementsByClassName("player")
  if(playerObjects) {
    while(playerObjects.length > 0) {
      playerObjects[0].parentNode.removeChild(playerObjects[0]);
    }
  }
}

function SendStart() {
  websocket.send(JSON.stringify({"type": "start"}));
}


function SendStand() {
  websocket.send(JSON.stringify({"type": "stand"}));
}


function SendHit() {
  websocket.send(JSON.stringify({"type": "hit"}));
}

function SendJoin() {
  websocket.send(JSON.stringify({"type": "joined"}));
}

function updatePlayerPositon(message) {
  let playerModel = document.getElementById(`player-model-${message.playerID}`)
  if(message.playerID != client.id) {
    if(playerModel) {
      playerModel.setAttribute("position", message.value)
    }
    else {
      CreatePlayerModel(message.playerID)
    }
  }
}

function CreatePlayerModel(id) {
  if(id) {
    let newPlayer = document.createElement('a-sphere')
    newPlayer.setAttribute("color", `#${Math.floor(Math.random()*16777215).toString(16)}`)
    newPlayer.setAttribute("radius", "10")
    newPlayer.setAttribute("id", `player-model-${id}`)
    newPlayer.setAttribute("scale", ".15 .16 .15")
    scene.appendChild(newPlayer);
  }
}

function removePlayerModel(id) {
  let playerModel = document.getElementById(`player-model-${id}`)
  playerModel.parentNode.removeChild(playerModel);
}

window.addEventListener("load", init, false);
