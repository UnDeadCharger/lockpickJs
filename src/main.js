import { getLockPickAngle, getInvertedXY, generateSweetSpot } from "./utils.js";
import {
  MAX_STRESS_LEVEL,
  ACCEPTABLE_INPUT,
  UNLOCK_THRESHOLD,
} from "./constant.js";

class App {
  // Tip 1: unnull the null - redesign so taht it eliminate null
  // Tip 2: use the right data structure
  // Tip 3:
  constructor() {
    this.root = document.documentElement;
    this.gameContainer = document.querySelector(".gameContainer");
    this.game = document.querySelector(".game");
    this.door = document.querySelector(".door");

    //Lock
    this.lock = document.querySelector(".lock");
    this.outer = document.querySelector(".outerhold"); //For calculating lockpick angle, not affected by its current rotation
    this.isMovingLock = false;
    this.lockProgress = 0; //Max is 90
    this.sweetspot = generateSweetSpot();
    this.currentMaxRotate = 0;

    //Pick
    this.pick = document.querySelector(".pick");
    this.stressLevel = 0;
    this.invertedX = 0;
    this.invertedY = 0;

    //Score Counter;
    this.scoreVar = document.querySelector(".score-var");
    this.highscoreVar = document.querySelector(".highscore-var");
    this.triesVar = document.querySelector(".tries-var");
    this.score = 0;
    this.tries = 2;
    this.highscore = localStorage.getItem("highscore") ?? 0;

    this.highscoreVar.textContent = this.highscore;
    this.triesVar.textContent = this.tries;
    this.scoreVar.textContent = this.score;

    this.disabledInput = false;

    this.loop = this.loop.bind(this);
  }

  async loop() {
    requestAnimationFrame(this.loop);
    if (this.disabledInput) {
      return;
    }
    if (this.lockProgress >= UNLOCK_THRESHOLD) {
      await this.unlock();
    }

    if (this.isMovingLock) {
      if (this.lockProgress < this.currentMaxRotate) {
        this.lockProgress += 1;
      }

      if (
        this.lockProgress >= this.currentMaxRotate &&
        this.currentMaxRotate < UNLOCK_THRESHOLD
      ) {
        //Stressing the pick
        //add key frame, key frame the shake based on stress level, add stress level as class to pick element
        this.stressLevel++;

        if (this.stressLevel > MAX_STRESS_LEVEL * 0.75) {
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
      await this.breakPick();
    }

    this.lock.style.transform = `rotate(${this.lockProgress}deg`;
  }

  async breakPick() {
    this.resetPick();
    this.disabledInput = true;
    const fastAnim =
      Math.abs(this.invertedX) < 300 || Math.abs(this.invertedY) < 300
        ? { x: this.invertedX * 5, y: this.invertedY * 5 }
        : { x: this.invertedX, y: this.invertedY };
    const pickBreakAnim = this.pick.animate(
      [
        { transform: `translateX(0px) translateY(0px)` },
        {
          transform: `translateX(${fastAnim.x}px) translateY(${fastAnim.y}px`,
        },
      ],
      {
        duration: 300, // in milliseconds
        iterations: 1,
        composite: "accumulate",
        endDelay: 300,
      }
    );
    await pickBreakAnim.finished;
    this.disabledInput = false;
    this.lockProgress = 0;
    this.triesVar.textContent = --this.tries;
    if (this.tries < 0) {
      this.lose();
    }
  }

  resetPick() {
    this.stressLevel = 0;
    this.isMovingLock = false;
    this.pick.classList.value = "pick";
    //disable all events for 0.5s seconds;
  }

  newLock() {
    this.game.animate(
      [{ transform: "scale(0.8)" }, { transform: "scale(1)" }],
      {
        duration: 500, // in milliseconds
        easing: "ease-in-out",
      }
    );

    this.sweetspot = generateSweetSpot();
  }

  async unlock() {
    //animation
    this.disabledInput = true;
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, 500)
    );
    this.lockProgress = 0;

    this.gameContainer.style.opacity = 0;

    const doorOpenAnim = this.door.animate(
      [
        {
          transform: "scaleX(100%) skewY(0deg)",
        },
        {
          transform: "scaleX(70%) skewY(5deg)",
        },
      ],
      {
        duration: 1500, // in milliseconds
        easing: "ease-in-out",
      }
    );
    await doorOpenAnim.finished;
    this.gameContainer.style.opacity = 1;
    this.disabledInput = false;

    this.newLock();

    //Scoring
    this.scoreVar.textContent = ++this.score;
    if (this.score > this.highscore) {
      this.highscoreVar.textContent = this.score;
      this.highscore = this.score;
      localStorage.setItem("highscore", this.highscore);
    }
  }

  lose() {
    this.newLock();
    this.resetPick();
    alert(`Out of lockpicks! Game Over! Total Score: ${this.score}`);
    this.score = 0;
    this.tries = 2;
    this.triesVar.textContent = this.tries;
    this.scoreVar.textContent = this.score;
  }

  updateMaxRotate(diff) {
    this.currentMaxRotate = Math.max(
      1,
      Math.min(90, Math.round((40 - diff) * 3))
    );
  }

  setupEvents() {
    document.addEventListener("mousemove", (e) => {
      if (this.disabledInput) {
        return;
      }
      const pickAngle = getLockPickAngle(e, this.outer);
      const { x, y } = getInvertedXY(e, this.outer);
      this.invertedX = x;
      this.invertedY = y;
      this.root.style.setProperty("--pick-angle", `${pickAngle}deg`);

      const diff = Math.abs(pickAngle - this.sweetspot);

      this.updateMaxRotate(diff);
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
