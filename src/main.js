import { getLockPickAngle } from "./utils.js";
const ACCEPTABLE_INPUT = ["w", "a", "s", "d"];

class App {
  // Tip 1: unnull the null - redesign so taht it eliminate null
  // Tip 2: use the right data structure
  // Tip 3:
  constructor() {
    this.root = document.documentElement;
    this.loop = this.loop.bind(this);
    this.counter = document.querySelector(".counter");
    this.progressBar = document.querySelector(".progressBarFill");
    this.pick = document.querySelector(".pick");
    this.lock = document.querySelector(".lock");
    this.isMovingLock = false;
    this.lockProgress = 0; //Max is probably 90
    this.sweetspot = 90;
    this.currentMaxRotate = 0;
    this.lock.style.transform = `rotate(${this.sweetspot}deg)`;
  }

  async loop() {
    requestAnimationFrame(this.loop);

    if (this.isMovingLock && this.lockProgress < this.currentMaxRotate) {
      this.lockProgress += 1;
    } else if (this.lockProgress > 0) {
      this.lockProgress -= 1;
    }
    this.lock.style.transform = `rotate(${this.lockProgress}deg`;
  }

  async execute(func) {}

  reset() {}

  processSweetspot(diff) {
    //sweetspot 90, diff = 10 maxRotate = 90
    // diff = 40 maxRotate = 0
    // diff = 39 maxRotate = 3  =>  29 = 1 && 0 = 30; > 90 = 90
    this.currentMaxRotate = Math.max(
      1,
      Math.min(90, Math.round((40 - diff) * 3))
    );
    // console.log(this.currentMaxRotate, (40 - diff) * 3);
    if (diff <= 10) {
      this.counter.textContent = `Lock open angle: ${this.sweetspot} - Perfect!`;
      // perfect
    } else if (diff <= 20) {
      this.counter.textContent = `Lock open angle: ${this.sweetspot} - Almost there!`;

      // close
    } else if (diff <= 30) {
      this.counter.textContent = `Lock open angle: ${this.sweetspot} - Getting Closer!`;

      // near
    } else {
      this.counter.textContent = `Lock open angle: ${this.sweetspot} - Not Budging`;

      // not budging
    }
  }

  setupEvents() {
    this.sweetspot = (Math.random() * 1000) % 180;

    document.addEventListener("mousemove", (e) => {
      this.progressBar.style.width = `${
        (e.clientX / this.root.scrollWidth) * 100
      }%`;
      const lockAngle = getLockPickAngle(e, this.lock);
      this.pick.style.transform = `rotate(${lockAngle}deg)`;

      const diff = Math.abs(lockAngle - this.sweetspot);

      this.processSweetspot(diff);
    });

    document.addEventListener("keydown", (e) => {
      if (!ACCEPTABLE_INPUT.includes(e.key.toLowerCase())) {
        return;
      }
      this.isMovingLock = true;
    });

    document.addEventListener("keyup", (e) => {
      if (!ACCEPTABLE_INPUT.includes(e.key.toLowerCase())) {
        return;
      }
      this.isMovingLock = false;
    });
  }
}

const app = new App();
app.setupEvents();
requestAnimationFrame(app.loop);

//Step 1: set up events, track mouse movement according to a value ranging from 0 to 180
//          Should probably learn how to convert px width into rotation
//Step 2: set up sweet spot mechanic - difference between the current pos percent * 180 and the sweet spot pos
//Sweetspot: 90
// 80 - 100: perfect - go full way
// 70-80 and 100-110: close - almost there go half way
// 60-70 and 110-120: near - go like 10%
// else: not budging

// We handle the lock movement from here
//Step 3: keydown rotate lock until 90deg
//Step 4; no key press gradually rotate back to 0deg

//Step 5: Make the rotate limit scale based on diff to sweetspot
//Make sure if sweetspot is over the 180 or under 0 limit, just cut it off
//Step 6: Randomize Sweetspot
//Step 7: // Rework the mouse detection so that it detect based on mouse position relative to the lock not the fullscreen

//Step 8: add lockpick stress;
//We can get the lock position using getBoundingClientRect, and retrieve it positional data according to mouse data

// max turning angle is relative to the diff
