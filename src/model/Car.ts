class Car {
  name: string;
  color: string;
  id: number;

  constructor(id: number, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }
}

export default Car;

export class Racer extends Car {
  time: number;
  success: boolean;

  constructor(id: number, name: string, color: string, time: number, success: boolean) {
    super(id, name, color);
    this.time = time;
    this.success = success;
  }
}

export class Winner {
  id: number;
  wins: number;
  time: number;

  constructor(id: number, wins: number, time: number) {
    this.id = id;
    this.wins = wins;
    this.time = time;
  }
}
