pub type Spectre {
  Red
  Green
  Blue
}

pub fn next_spectre(s: Spectre) -> Spectre {
  case s {
    Red -> Green
    Green -> Blue
    Blue -> Red
  }
}

pub fn spectre_from_int(i: Int) -> Spectre {
  case i % 3 {
    0 -> Red
    1 -> Green
    _ -> Blue
  }
}

// ⚡ POWER-UP TYPE
pub type PowerUpType {
  Invincibility
  Magnet
  SlowMotion
}

pub fn powerup_from_int(i: Int) -> PowerUpType {
  case i % 3 {
    0 -> Invincibility
    1 -> Magnet
    _ -> SlowMotion
  }
}

// ⚡ POWER-UP
pub type PowerUp {
  PowerUp(x: Float, lane: Int, type_: PowerUpType)
}

pub type Player {
  Player(lane: Int, spectre: Spectre)
}

pub type Obstacle {
  Obstacle(x: Float, lane: Int, color: Spectre)
}

pub type Diamond {
  Diamond(x: Float, lane: Int, color: Spectre)
}

pub type Input {
  Input(
    start: Bool,
    restart: Bool,
    switch_spectre: Bool,
    move_left: Bool,
    move_right: Bool,
  )
}

pub fn empty_input() -> Input {
  Input(False, False, False, False, False)
}

pub type Screen {
  Menu
  Playing
  GameOver
}

// 🎮 MODE DE JEU
pub type GameMode {
  Classic
  TimeAttack
}

pub fn mode_from_string(s: String) -> GameMode {
  case s {
    "timeattack" -> TimeAttack
    _ -> Classic
  }
}

// ⚡ ACTIVE POWER-UPS
pub type ActivePowerUps {
  ActivePowerUps(
    invincibility_timer: Float,
    magnet_timer: Float,
    slowmotion_timer: Float,
  )
}

// 🎮 GAME STATE
pub type GameState {
  GameState(
    screen: Screen,
    mode: GameMode,
    width: Int,
    height: Int,
    time: Float,
    timer: Float,
    speed: Float,
    distance: Float,
    score: Int,
    player: Player,
    obstacles: List(Obstacle),
    diamonds: List(Diamond),
    powerups: List(PowerUp),
    last_obstacle_distance: Float,
    last_diamond_distance: Float,
    last_powerup_distance: Float,
    rng_seed: Int,
    combo: Int,
    combo_timer: Float,
    active_powerups: ActivePowerUps,
  )
}
