import gleam/io
import gleam/json

import game/logic
import game/types

pub fn main() {
  io.println("Spectral Run — Gleam OK")
}

pub fn init(width: Int, height: Int, mode: String) -> String {
  let state = logic.init(width, height, mode)
  set_global_state(state)
  encode_state(state)
}

@external(javascript, "./spectral_run_ffi.mjs", "get_global_state")
fn get_global_state() -> types.GameState

@external(javascript, "./spectral_run_ffi.mjs", "set_global_state")
fn set_global_state(state: types.GameState) -> Nil

pub fn update(_state_json: String, dt: Float, input_json: String) -> String {
  let input = parse_input_ffi(input_json)
  let state = get_global_state()
  let new_state = logic.update(state, dt, input)
  set_global_state(new_state)
  encode_state(new_state)
}

@external(javascript, "./spectral_run_ffi.mjs", "parse_input_json")
fn parse_input_ffi(json_str: String) -> types.Input

fn encode_state(state: types.GameState) -> String {
  json.object([




















  ])
  |> json.to_string
}

fn encode_screen(screen: types.Screen) -> json.Json {
  case screen {
    types.Menu -> json.string("menu")
    types.Playing -> json.string("playing")
    types.GameOver -> json.string("gameover")
  }
}

fn encode_mode(mode: types.GameMode) -> json.Json {
  case mode {
    types.Classic -> json.string("classic")
    types.TimeAttack -> json.string("timeattack")
  }
}

fn encode_player(player: types.Player) -> json.Json {
  json.object([


  ])
}

fn encode_spectre(spectre: types.Spectre) -> json.Json {
  case spectre {
    types.Red -> json.string("red")
    types.Green -> json.string("green")
    types.Blue -> json.string("blue")
  }
}

fn encode_obstacle(obstacle: types.Obstacle) -> json.Json {
  json.object([



  ])
}

fn encode_diamond(diamond: types.Diamond) -> json.Json {
  json.object([



  ])
}

fn encode_powerup(powerup: types.PowerUp) -> json.Json {
  json.object([



  ])
}

fn encode_powerup_type(ptype: types.PowerUpType) -> json.Json {
  case ptype {
    types.Invincibility -> json.string("invincibility")
    types.Magnet -> json.string("magnet")
    types.SlowMotion -> json.string("slowmotion")
  }
}

fn encode_active_powerups(pups: types.ActivePowerUps) -> json.Json {
  json.object([



  ])
}





