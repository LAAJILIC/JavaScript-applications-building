'use strict';
////////// challenge 1

const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};
Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(this.speed);
};
Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(this.speed);
};
const car1 = new Car('BMW', 120);
const car2 = new Car('Mercedes', 95);
car1.accelerate();
car1.brake();
car2.accelerate();
car2.brake();
car1.accelerate();
car2.brake();
car2.accelerate();
car1.brake();

///// challenge 2 ( do it using ES6 class)

class CarClass {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }
  accelerate() {
    this.speed += 10;
    return this.speed;
  }
  brake() {
    this.speed -= 5;
    console.log(this.speed);
    return this.speed;
  }
  monitorSpeed() {
    if (this.speed > 50) {
      for (let i = 0; i < (this.speed - 50) / 0.5; i++) {
        this.brake();
      }
    }
  }
  get speedUs() {
    return this.speed / 1.6;
  }
  set speedUs(speed) {
    this.speed = speed * 1.6;
  }
}
const bmw = new CarClass('BMW', 100);
const citroen = new CarClass('Citroen', 80);
bmw.accelerate();
bmw.brake();
citroen.monitorSpeed();
//bmw.speedUs(this.speed);  //NOOO;
bmw.speedUs = 50;
console.log(bmw);

/////challenge 3 : linking classes

const EV = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};
EV.prototype = Object.create(Car.prototype);

EV.prototype.chargeBattery = function (chargeTo) {
  this.charge = chargeTo;
};
EV.prototype.accelerate = function () {
  this.speed += 20;
  this.charge -= 1;
  console.log(
    `${this.make} going at ${this.speed} km/h, with a charge of ${this.charge}%`
  );
};

const tesla = new EV('Tesla', 120, 90);
console.log(tesla);
tesla.accelerate();
tesla.brake();
tesla.chargeBattery(23);
tesla.accelerate();
