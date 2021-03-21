export class Card {
  value: string;
  suit: string;

  constructor(value: string, suit: string) {
      this.value = value;
      this.suit = suit;
  }

  public toString() {
      return `${this.value} of ${this.suit}s`;
  }

  public getNumericValue(aceValue: number = 11) {
      if(['J', 'Q', 'K'].find(x => x === this.value)) {
          return 10;
        }
        else if(this.value == 'A') {
          return aceValue
        }
        return parseInt(this.value)
  }
}
