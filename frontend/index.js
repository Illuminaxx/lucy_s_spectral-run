import * as spectral_run from "../build/dev/javascript/spectral_run/spectral_run.mjs";
import { render } from "./render.js";
import { audioSystem } from './audio.js';

let stateJson = null;
let lastTime = 0;
let selectedMode = 'classic';

const input = {
  start: false,
  restart: false,
  switch_spectre: false,
  move_left: false,
  move_right: false,
  change_mode_left: false,
  change_mode_right: false,
};

let moveLeftCooldown = 0;
let moveRightCooldown = 0;
const MOVE_COOLDOWN = 0.15;

window.addEventListener("keydown", (e) => {

  audioSystem.init();
  
  if (e.key === "Enter") input.start = true;
  if (e.key === "r") input.restart = true;
  if (e.key === " ") input.switch_spectre = true;
  if (e.key === "ArrowLeft" || e.key === "q") {
    input.move_left = true;
    input.change_mode_left = true;
  }
  if (e.key === "ArrowRight" || e.key === "d") {
    input.move_right = true;
    input.change_mode_right = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Enter") input.start = false;
  if (e.key === "r") input.restart = false;
  if (e.key === " ") input.switch_spectre = false;
  if (e.key === "ArrowLeft" || e.key === "q") {
    input.move_left = false;
    input.change_mode_left = false;
  }
  if (e.key === "ArrowRight" || e.key === "d") {
    input.move_right = false;
    input.change_mode_right = false;
  }
});

const canvas = document.getElementById("game");

canvas.addEventListener("touchstart", (e) => {
  audioSystem.init();
  
  const x = e.touches[0].clientX;
  const mid = window.innerWidth / 2;

  input.move_left = x < mid;
  input.move_right = x > mid;
});

canvas.addEventListener("touchend", () => {
  input.move_left = false;
  input.move_right = false;
});

stateJson = spectral_run.init(canvas.width, canvas.height, selectedMode);
window.gameState = stateJson;

let menuModeChangeCooldown = 0;

function frame(t) {
  const dt = (t - lastTime) / 1000;
  lastTime = t;

  const state = JSON.parse(stateJson);

  if (state.screen === "menu") {
    if (menuModeChangeCooldown > 0) {
      menuModeChangeCooldown -= dt;
    }

    if ((input.change_mode_left || input.change_mode_right) && menuModeChangeCooldown <= 0) {
      selectedMode = selectedMode === 'classic' ? 'timeattack' : 'classic';

      stateJson = spectral_run.init(canvas.width, canvas.height, selectedMode);
      menuModeChangeCooldown = 0.2; // Cooldown pour éviter les changements trop rapides
      audioSystem.playColorSwitch(); // Son de changement
    }

    if (input.start) {
      stateJson = spectral_run.init(canvas.width, canvas.height, selectedMode);
    }
  }

  if (moveLeftCooldown > 0) {
    moveLeftCooldown -= dt;
  }
  if (moveRightCooldown > 0) {
    moveRightCooldown -= dt;
  }

  const modifiedInput = state.screen === "playing" ? {
    start: input.start,
    restart: input.restart,
    switch_spectre: input.switch_spectre,
    move_left: input.move_left && moveLeftCooldown <= 0,
    move_right: input.move_right && moveRightCooldown <= 0,
  } : {
    start: input.start,
    restart: input.restart,
    switch_spectre: input.switch_spectre,
    move_left: false,
    move_right: false,
  };

  if (modifiedInput.move_left) {
    moveLeftCooldown = MOVE_COOLDOWN;
  }
  if (modifiedInput.move_right) {
    moveRightCooldown = MOVE_COOLDOWN;
  }

  stateJson = spectral_run.update(
    stateJson,
    dt,
    JSON.stringify(modifiedInput)
  );
  
  window.gameState = stateJson; 

  render(canvas, stateJson, dt, selectedMode);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);





