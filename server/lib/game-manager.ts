import { wss } from "..";
import { Deck } from "./deck"
import { Player } from "./player"
import { replacer, replaceWs } from './utility'
import { Update, UpdateType } from './update'

export class GameManager {
  players: Player[] = [];
  dealer: Player = new Player("dealer", null);
  deck: Deck = new Deck();

  public CreatePlayer(ws:any) {
    console.log("Creating Player")
    var player:Player = new Player(ws.id, ws)
    this.players.push(player);
  }

  public DeletePlayer(id:string) {
    console.log("Deleting Player")
    var playerIndex = this.players.findIndex(x => x.id == id);
    this.players.splice(playerIndex, 1)

    var disconnectUpdate:Update = new Update(UpdateType.Disconnect, id, id)
    wss.broadcast(JSON.stringify(disconnectUpdate))
  }

  public startGame() {
    var gameStarting:Update = new Update(UpdateType.GameStarting, "", "")
    wss.broadcast(JSON.stringify(gameStarting))

    this.players.forEach(player => {
      player.cards = []
      player.standing = false;
    });

    this.deck = new Deck();

    this.players.forEach(player => {
      player.hiddenCard = this.deck.deal()!
      player.cards.push(this.deck.deal()!)
    })

    this.dealer = new Player("dealer", null);
    this.dealer.hiddenCard = this.deck.deal()!
    this.dealer.cards.push(this.deck.deal()!)

    var dealerUpdate: Update = new Update(UpdateType.Dealer, this.dealer.id, this.dealer)
    wss.broadcast(JSON.stringify(dealerUpdate, replacer))

    var playersUpdate: Update = new Update(UpdateType.Players, '', this.players)
    wss.broadcast(JSON.stringify(playersUpdate, replacer))

    this.players.forEach(player => {
      var hiddenCardUpdate: Update = new Update(UpdateType.HiddenCard, player.id, player.hiddenCard)
      player.ws.send(JSON.stringify(hiddenCardUpdate))
    })
  }

  public playerHit(playerID: string) {
    if(playerID == "dealer") {
      this.dealer.cards.push(this.deck.deal()!)
    }
    else {
      var player:Player = this.players.find(x => x.id === playerID)!;
      if(!player.standing && player.cardsValue() < 21) {
        player.cards.push(this.deck.deal()!)
        var playerUpdate:Update = new Update(UpdateType.Players, player.id, player)
        wss.broadcast(JSON.stringify(playerUpdate, replacer));
      }
    }
  }

  public playerStand(playerID:string) {
    var player:Player = this.players.find(x => x.id === playerID)!;
    if(player.standing) {
      console.log(`Player ${player.id} already standing.`)
    }
    else {
      player.standing = true;
    }
    var allStanding:boolean = true;
    this.players.forEach(player => {
      if(!player.standing) {
        allStanding = false;
      }
    });
    if(allStanding) {
      this.endGame();
    }
  }

  public endGame() {
    var hiddenCardUpdate:Update = new Update(UpdateType.HiddenCard, this.dealer.id, this.dealer.hiddenCard)
    wss.broadcast(JSON.stringify(hiddenCardUpdate))

    while(this.dealer.cardsValue() < 17)
    {
      this.playerHit(this.dealer.id)
    }

    var dealerUpdate:Update = new Update(UpdateType.Dealer, this.dealer.id, this.dealer)
    wss.broadcast(JSON.stringify(dealerUpdate, replacer))

    this.players.forEach(player => {
      var playerHiddenUpdate:Update = new Update(UpdateType.HiddenCard, player.id, player.hiddenCard)
      wss.broadcast(JSON.stringify(playerHiddenUpdate))

      var winnerUpdate:Update = new Update(UpdateType.Win, player.id, "You Win!")
      var drawUpdate:Update = new Update(UpdateType.Win, player.id, "It's a Draw!")
      var looseUpdate:Update = new Update(UpdateType.Win, player.id, "You Lose!")
      if(!player.isBusted()) {
        if(this.dealer.isBusted()) {
          player.ws.send(JSON.stringify(winnerUpdate))
        }
        else if(player.cardsValue() == this.dealer.cardsValue()) {
          player.ws.send(JSON.stringify(drawUpdate))
        }
        else if(player.cardsValue() > this.dealer.cardsValue()) {
          player.ws.send(JSON.stringify(winnerUpdate))
        }
        else {
          player.ws.send(JSON.stringify(looseUpdate))
        }
      }
      else {
        player.ws.send(JSON.stringify(looseUpdate))
      }
    })
  }

  public movePlayer(clientID:string, value:string) {
    var playerPositionUpdate:Update = new Update(UpdateType.PlayerPosition, clientID, value)
    wss.broadcast(JSON.stringify(playerPositionUpdate))
  }
}
