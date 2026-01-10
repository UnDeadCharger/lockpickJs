import { getLockPickAngle, getInvertedXY, generateSweetSpot } from "./utils.js";
const ACCEPTABLE_INPUT = ["w", "a", "s", "d"];
const MAX_STRESS_LEVEL = 100;
class App {
  // Tip 1: unnull the null - redesign so taht it eliminate null
  // Tip 2: use the right data structure
  // Tip 3:
  constructor() {
    this.root = document.documentElement;

    //Lock
    this.lock = document.querySelector(".lock");
    this.outer = document.querySelector(".outerhold");
    this.isMovingLock = false;
    this.lockProgress = 0; //Max is probably 90
    this.sweetspot = generateSweetSpot();
    this.currentMaxRotate = 0;

    //Pick
    this.pick = document.querySelector(".pick");
    this.stressLevel = 0;
    this.invertedX = 0;
    this.invertedY = 0;

    this.counter = document.querySelector(".counter");
    this.progressBar = document.querySelector(".progressBarFill");
    this.disabledInput = false;

    this.loop = this.loop.bind(this);
  }

  async loop() {
    requestAnimationFrame(this.loop);
    if (this.lockProgress >= 90) {
      this.unlock();
    }

    if (this.isMovingLock) {
      if (this.lockProgress < this.currentMaxRotate) {
        this.lockProgress += 1;
      }

      if (
        this.lockProgress >= this.currentMaxRotate &&
        this.currentMaxRotate < 90
      ) {
        //Stressing the pick
        //add key frame, key frame the shake based on stress level, add stress level as class to pick element
        this.stressLevel++;

        if (this.stressLevel > MAX_STRESS_LEVEL * 0.8) {
          this.pick.classList.value = "pick stress3";
        } else if (this.stressLevel > MAX_STRESS_LEVEL * 0.5) {
          this.pick.classList.value = "pick stress2";
        } else if (this.stressLevel > 0) {
          this.pick.classList.value = "pick stress1";
        }
      }
    } else if (this.lockProgress > 0) {
      this.lockProgress -= 1;
      this.pick.classList.value = "pick";
    }

    if (this.stressLevel >= MAX_STRESS_LEVEL) {
      this.breakPick();
    }

    this.lock.style.transform = `rotate(${this.lockProgress}deg`;
  }

  async execute(func) {}

  breakPick() {
    this.disabledInput = true;
    const fastAnim =
      Math.abs(this.invertedX) < 300 || Math.abs(this.invertedY) < 300
        ? { x: this.invertedX * 5, y: this.invertedY * 5 }
        : { x: this.invertedX, y: this.invertedY };
    this.pick.animate(
      [
        { transform: `translateX(0px) translateY(0px)` },
        {
          transform: `translateX(${fastAnim.x}px) translateY(${fastAnim.y}px`,
        },
      ],
      {
        duration: 500, // in milliseconds
        iterations: 1,
        composite: "accumulate",
      }
    );
    setTimeout(() => {
      this.disabledInput = false;
      this.lockProgress = 0;
    }, 2000);
    this.resetPick();
  }

  resetPick() {
    this.stressLevel = 0;
    this.isMovingLock = false;
    this.pick.classList.value = "pick";
    //disable all events for 0.5s seconds;
  }

  resetLock() {
    this.sweetspot = generateSweetSpot();
  }

  unlock() {
    alert("Lock opened!");
    this.resetPick();
    this.lockProgress = 0;
    this.resetLock();
  }

  processSweetspot(diff) {
    //sweetspot 90, diff = 10 maxRotate = 90
    // diff = 40 maxRotate = 0
    // diff = 39 maxRotate = 3  =>  29 = 1 && 0 = 30; > 90 = 90
    this.currentMaxRotate = Math.max(
      1,
      Math.min(90, Math.round((40 - diff) * 3))
    );
    this.counter.textContent = `Lock open angle: ${this.sweetspot} - Stress: ${this.stressLevel}`;
    if (diff <= 10) {
      this.counter.textContent += `- Perfect!`;
      // perfect
    } else if (diff <= 20) {
      this.counter.textContent += `- Almost there!`;

      // close
    } else if (diff <= 30) {
      this.counter.textContent += `- Getting Closer!`;

      // near
    } else {
      this.counter.textContent += `- Not Budging`;

      // not budging
    }
  }

  setupEvents() {
    document.addEventListener("mousemove", (e) => {
      if (this.disabledInput) {
        return;
      }
      this.progressBar.style.width = `${
        (e.clientX / this.root.scrollWidth) * 100
      }%`;
      const pickAngle = getLockPickAngle(e, this.outer);
      const { x, y } = getInvertedXY(e, this.outer);
      this.invertedX = x;
      this.invertedY = y;
      // this.pick.style.transform = `rotate(${lockAngle}deg)`;
      this.root.style.setProperty("--pick-angle", `${pickAngle}deg`);

      const diff = Math.abs(pickAngle - this.sweetspot);

      this.processSweetspot(diff);
    });

    document.addEventListener("keydown", (e) => {
      if (this.disabledInput) {
        return;
      }
      if (!ACCEPTABLE_INPUT.includes(e.key.toLowerCase())) {
        return;
      }
      this.isMovingLock = true;
    });

    document.addEventListener("keyup", (e) => {
      if (this.disabledInput) {
        return;
      }
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
//Lock pick stress -> lockpick break > pause input > play lockpick break animation -> reset();
// stress formula

//Step 9: unlockning;
//Step 9: asset animation;
//Step 10: reset lock

//We can get the lock position using getBoundingClientRect, and retrieve it positional data according to mouse data

// max turning angle is relative to the difft

//Step 11: Break pick animation
// Make .pick fly off the screen
// Reduce length of .pick:after to zero.
// Make .pick fly back in to the hold
// Reset the pick to original state

//Lock pick only wobble when stressing
