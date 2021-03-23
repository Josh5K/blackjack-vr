export enum UpdateType {
  Players = "Players",
  HiddenCard = "HiddenCard",
  Client = "Client",
  Dealer = "Dealer",
  Win = "Win",
  GameStarting = "GameStarting",
  PlayerPosition = "PlayerPosition",
  Disconnect = "Disconnect"
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
