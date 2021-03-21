import { GameManager } from "./game-manager"

export class MessageHandler {
  static gm: GameManager =  new GameManager();

  public static handleMessage(message:any, ws:any) {
    if(this.gm.players.find(x => x.id == ws.id) == undefined) {
      this.gm.CreatePlayer(ws)
    }

    switch (message.type) {
      case "hit":
        console.log(`${ws.id} is hitting!`)
        this.gm.playerHit(ws.id)
        break;
      case "stand":
        console.log(`${ws.id} is standing!`)
        this.gm.playerStand(ws.id);
        break;
      case "start":
        console.log(`${ws.id} is starting a game!`)
        this.gm.startGame();
        break;
      case "playerposition":
        this.gm.movePlayer(ws.id, message.value)
        break;
      case "joined":
        console.log("PlayerJoined")
        break;
      default:
        console.log("Unknown message!")
        console.log(message.type)
        break;
    }
  }
}
