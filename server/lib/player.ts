import { Card } from "./card"
export class Player {
  id: string;
  cards: Card[];
  hiddenCard: Card;
  ws: any;
  standing: boolean;
  positionX: number;
  positionZ: number;

  constructor(id: string, ws: any) {
      this.id = id;
      this.cards = [];
      this.hiddenCard = new Card('0', '0')
      this.ws = ws;
      this.standing = false;
      this.positionX = 0;
      this.positionZ = 0;
  }

  public cardsValue() {
    let score:number = 0;
    let cards:Card[] = this.cards

    cards.forEach(card => {
      score += card.getNumericValue();
    });

    score += this.hiddenCard.getNumericValue();

    if(score > 21) {
      cards.forEach(card => {
        if(card.value =='A' && score > 21) {
          score -= 10;
        }
      });
    }
    return score
  }

  public isBusted() {
    return this.cardsValue() > 21;
  }
}
