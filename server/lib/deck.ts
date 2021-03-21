import { Card } from "./card"

export class Deck {
  values: string[];
  suits: string[];
  cards: Card[];

  constructor() {
    this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.suits = [ 'C', 'H', 'S', 'D'];
    this.cards = [];

    this.suits.forEach( (suit) => {
      this.values.forEach( (value) => {
          this.cards.push(new Card(value, suit))
      })
    })
    this.shuffle();
  }

  public deal() {
    if(this.cards) {
      return this.cards.shift!();
    }
  }

  public toString() {
      return '[' + this.cards.join(', ') + ']';
  }

  public shuffle() {
    var currentIndex = this.cards.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }

    return this.cards;
  }
}
