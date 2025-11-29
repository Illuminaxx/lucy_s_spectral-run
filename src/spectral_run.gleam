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
    #("screen", encode_screen(state.screen)),
    #("mode", encode_mode(state.mode)),
    #("width", json.int(state.width)),
    #("height", json.int(state.height)),
    #("time", json.float(state.time)),
    #("timer", json.float(state.timer)),
    #("speed", json.float(state.speed)),
    #("distance", json.float(state.distance)),
    #("score", json.int(state.score)),
    #("player", encode_player(state.player)),
    #("obstacles", json.array(state.obstacles, encode_obstacle)),
    #("diamonds", json.array(state.diamonds, encode_diamond)),
    #("powerups", json.array(state.powerups, encode_powerup)),
    #("last_obstacle_distance", json.float(state.last_obstacle_distance)),
    #("last_diamond_distance", json.float(state.last_diamond_distance)),
    #("last_powerup_distance", json.float(state.last_powerup_distance)),
    #("rng_seed", json.int(state.rng_seed)),
    #("combo", json.int(state.combo)),
    #("combo_timer", json.float(state.combo_timer)),
    #("active_powerups", encode_active_powerups(state.active_powerups)),
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
    #("lane", json.int(player.lane)),
    #("spectre", encode_spectre(player.spectre)),
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
    #("x", json.float(obstacle.x)),
    #("lane", json.int(obstacle.lane)),
    #("color", encode_spectre(obstacle.color)),
  ])
}

fn encode_diamond(diamond: types.Diamond) -> json.Json {
  json.object([
    #("x", json.float(diamond.x)),
    #("lane", json.int(diamond.lane)),
    #("color", encode_spectre(diamond.color)),
  ])
}

fn encode_powerup(powerup: types.PowerUp) -> json.Json {
  json.object([
    #("x", json.float(powerup.x)),
    #("lane", json.int(powerup.lane)),
    #("type", encode_powerup_type(powerup.type_)),
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
    #("invincibility", json.float(pups.invincibility_timer)),
    #("magnet", json.float(pups.magnet_timer)),
    #("slowmotion", json.float(pups.slowmotion_timer)),
  ])
}
