import game/config
import game/types
import gleam/list

pub type GameState =
  types.GameState

// ─────────────────────────────
// INIT
// ─────────────────────────────

pub fn init(w: Int, h: Int, mode_str: String) -> GameState {
  let p = types.Player(lane: 2, spectre: types.Red)
  let active_pups = types.ActivePowerUps(
    invincibility_timer: 0.0,
    magnet_timer: 0.0,
    slowmotion_timer: 0.0,
  )
  
  let mode = types.mode_from_string(mode_str)
  
  // Paramètres selon le mode
  let #(initial_speed, timer) = case mode {
    types.Classic -> #(config.base_speed, 0.0)
    types.TimeAttack -> #(config.timeattack_base_speed, config.timeattack_duration)
  }

  types.GameState(
    screen: types.Menu,
    mode: mode,
    width: w,
    height: h,
    time: 0.0,
    timer: timer,
    speed: initial_speed,
    distance: 0.0,
    score: 0,
    player: p,
    obstacles: [],
    diamonds: [],
    powerups: [],
    last_obstacle_distance: 0.0,
    last_diamond_distance: 0.0,
    last_powerup_distance: 0.0,
    rng_seed: 42,
    combo: 0,
    combo_timer: 0.0,
    active_powerups: active_pups,
  )
}

// ─────────────────────────────
// GLOBAL UPDATE
// ─────────────────────────────

pub fn update(s: GameState, dt: Float, input: types.Input) -> GameState {
  case s.screen {
    types.Menu ->
      case input.start {
        True -> start(s)
        False -> tick(s, dt)
      }

    types.GameOver ->
      case input.restart {
        True -> init(s.width, s.height, mode_to_string(s.mode))
        False -> tick(s, dt)
      }

    types.Playing -> update_playing(s, dt, input)
  }
}

fn mode_to_string(mode: types.GameMode) -> String {
  case mode {
    types.Classic -> "classic"
    types.TimeAttack -> "timeattack"
  }
}

fn tick(s: GameState, dt: Float) -> GameState {
  types.GameState(..s, time: s.time +. dt)
}

fn start(s: GameState) -> GameState {
  let n = init(s.width, s.height, mode_to_string(s.mode))
  types.GameState(..n, screen: types.Playing)
}

// ─────────────────────────────
// PLAYING LOOP
// ─────────────────────────────

fn update_playing(s: GameState, dt: Float, input: types.Input) -> GameState {
  let time = s.time +. dt
  
  // ⏱️ Time Attack - décrémenter le timer
  let new_timer = case s.mode {
    types.TimeAttack -> s.timer -. dt
    types.Classic -> 0.0
  }
  
  // ⏱️ Vérifier si temps écoulé en Time Attack
  let game_over = case s.mode {
    types.TimeAttack -> new_timer <=. 0.0
    types.Classic -> False
  }
  
  case game_over {
    True -> types.GameState(..s, screen: types.GameOver, timer: 0.0)
    False -> {
      // ⚡ Appliquer slow motion si actif
      let speed_multiplier = case s.active_powerups.slowmotion_timer >. 0.0 {
        True -> config.slowmotion_factor
        False -> 1.0
      }
      
      // En Time Attack, pas d'accélération progressive
      let speed = case s.mode {
        types.Classic -> s.speed +. { config.speed_increment_per_second *. dt *. speed_multiplier }
        types.TimeAttack -> config.timeattack_base_speed *. speed_multiplier
      }
      
      let dist = s.distance +. { speed *. dt }

      let s1 = types.GameState(..s, time: time, timer: new_timer, speed: speed, distance: dist)
      let s2 = apply_input(s1, input)
      let s3 = spawn_entities(s2)
      let s4 = move_entities(s3, dt)
      let s5 = update_powerups(s4, dt)
      let s6 = update_combo_timer(s5, dt)
      let s7 = handle_collisions(s6)
      s7
    }
  }
}

// ─────────────────────────────
// INPUT
// ─────────────────────────────

fn apply_input(s: GameState, i: types.Input) -> GameState {
  let p = s.player

  // Switch spectre
  let p2 = case i.switch_spectre {
    True -> types.Player(..p, spectre: types.next_spectre(p.spectre))
    False -> p
  }

  // Move left / right
  let p3 = case i.move_left || i.move_right {
    False -> p2
    True -> {
      let new_lane = case i.move_left {
        True -> p2.lane - 1
        False -> p2.lane + 1
      }

      let clamped = case new_lane < 1 {
        True -> 1
        False ->
          case new_lane > config.lanes {
            True -> config.lanes
            False -> new_lane
          }
      }

      types.Player(..p2, lane: clamped)
    }
  }

  types.GameState(..s, player: p3)
}

// ─────────────────────────────
// SPAWN OBSTACLES, DIAMONDS & POWER-UPS
// ─────────────────────────────

fn spawn_entities(s: GameState) -> GameState {
  let dist = s.distance
  
  // Espacement des diamants selon le mode
  let dia_spacing = case s.mode {
    types.Classic -> config.diamond_spacing
    types.TimeAttack -> config.timeattack_diamond_spacing
  }

  // Obstacles
  let #(obs, last_obs, seed1) = case
    dist -. s.last_obstacle_distance >=. config.obstacle_spacing
  {
    True -> {
      let #(lane, col, ns) = random_obstacle(s.rng_seed)
      let o = types.Obstacle(x: dist +. 600.0, lane: lane, color: col)
      #([o, ..s.obstacles], dist, ns)
    }
    False -> #(s.obstacles, s.last_obstacle_distance, s.rng_seed)
  }

  // Diamonds
  let #(dias, last_dia, seed2) = case
    dist -. s.last_diamond_distance >=. dia_spacing
  {
    True -> {
      let #(lane2, col2, ns2) = random_obstacle(seed1)
      let d = types.Diamond(x: dist +. 500.0, lane: lane2, color: col2)
      #([d, ..s.diamonds], dist, ns2)
    }
    False -> #(s.diamonds, s.last_diamond_distance, seed1)
  }

  // Power-ups ⚡
  let #(pups, last_pup, seed3) = case
    dist -. s.last_powerup_distance >=. config.powerup_spacing
  {
    True -> {
      let #(lane3, ns3) = random_lane(seed2)
      let pup_type = types.powerup_from_int(i_abs(ns3))
      let pup = types.PowerUp(x: dist +. 700.0, lane: lane3, type_: pup_type)
      #([pup, ..s.powerups], dist, ns3)
    }
    False -> #(s.powerups, s.last_powerup_distance, seed2)
  }

  types.GameState(
    ..s,
    obstacles: obs,
    diamonds: dias,
    powerups: pups,
    last_obstacle_distance: last_obs,
    last_diamond_distance: last_dia,
    last_powerup_distance: last_pup,
    rng_seed: seed3,
  )
}

// ─────────────────────────────
// MOVE ENTITIES
// ─────────────────────────────

fn move_entities(s: GameState, dt: Float) -> GameState {
  let speed = s.speed

  let obs =
    s.obstacles
    |> list.map(fn(o) { types.Obstacle(..o, x: o.x -. { speed *. dt }) })
    |> list.filter(fn(o) { o.x >. { s.distance -. 800.0 } })

  let dias =
    s.diamonds
    |> list.map(fn(d) { types.Diamond(..d, x: d.x -. { speed *. dt }) })
    |> list.filter(fn(d) { d.x >. { s.distance -. 800.0 } })

  let pups =
    s.powerups
    |> list.map(fn(p) { types.PowerUp(..p, x: p.x -. { speed *. dt }) })
    |> list.filter(fn(p) { p.x >. { s.distance -. 800.0 } })

  types.GameState(..s, obstacles: obs, diamonds: dias, powerups: pups)
}

// ─────────────────────────────
// UPDATE POWER-UPS TIMERS
// ─────────────────────────────

fn update_powerups(s: GameState, dt: Float) -> GameState {
  let pups = s.active_powerups
  
  let new_invincibility = case pups.invincibility_timer >. 0.0 {
    True -> pups.invincibility_timer -. dt
    False -> 0.0
  }
  
  let new_magnet = case pups.magnet_timer >. 0.0 {
    True -> pups.magnet_timer -. dt
    False -> 0.0
  }
  
  let new_slowmo = case pups.slowmotion_timer >. 0.0 {
    True -> pups.slowmotion_timer -. dt
    False -> 0.0
  }
  
  let new_pups = types.ActivePowerUps(
    invincibility_timer: new_invincibility,
    magnet_timer: new_magnet,
    slowmotion_timer: new_slowmo,
  )
  
  types.GameState(..s, active_powerups: new_pups)
}

// ─────────────────────────────
// UPDATE COMBO TIMER 🔥
// ─────────────────────────────

fn update_combo_timer(s: GameState, dt: Float) -> GameState {
  case s.combo_timer >. 0.0 {
    True -> {
      let new_timer = s.combo_timer -. dt
      case new_timer <=. 0.0 {
        True -> types.GameState(..s, combo: 0, combo_timer: 0.0)
        False -> types.GameState(..s, combo_timer: new_timer)
      }
    }
    False -> s
  }
}

// ─────────────────────────────
// FLOAT ABS
// ─────────────────────────────

fn f_abs(x: Float) -> Float {
  case x <. 0.0 {
    True -> x *. -1.0
    False -> x
  }
}

// ─────────────────────────────
// COLLISIONS
// ─────────────────────────────

fn handle_collisions(s: GameState) -> GameState {
  let px = config.world_player_x
  let lane = s.player.lane

  // ⚡ Invincibilité active ?
  let is_invincible = s.active_powerups.invincibility_timer >. 0.0

  // Obstacles
  let #(rev_obs, dead) =
    list.fold(s.obstacles, #([], False), fn(acc, o) {
      let #(acc_obs, acc_dead) = acc
      let relative_x = o.x -. s.distance
      let dx = f_abs(relative_x -. px)
      let hit = dx <. config.collision_radius_x && o.lane == lane

      case hit {
        True ->
          case is_invincible {
            True -> #([o, ..acc_obs], acc_dead)
            False -> 
              case o.color == s.player.spectre {
                True -> #([o, ..acc_obs], acc_dead)
                False -> #(acc_obs, True)
              }
          }

        False -> #([o, ..acc_obs], acc_dead)
      }
    })

  let obstacles = list.reverse(rev_obs)

  // ⚡ Aimant actif ? Rayon de collecte élargi
  let diamond_radius = case s.active_powerups.magnet_timer >. 0.0 {
    True -> 200.0
    False -> 100.0
  }

  // Diamonds 🔥 AVEC COMBO
  let #(rev_dia, count) =
    list.fold(s.diamonds, #([], 0), fn(acc, d) {
      let #(acc_ds, acc_c) = acc
      let relative_x = d.x -. s.distance
      let dx = f_abs(relative_x -. px)
      let hit = dx <. diamond_radius && d.lane == lane

      case hit {
        True -> 
          case d.color == s.player.spectre {
            True -> #(acc_ds, acc_c + 1)
            False -> #([d, ..acc_ds], acc_c)
          }
        False -> #([d, ..acc_ds], acc_c)
      }
    })

  let dias = list.reverse(rev_dia)
  
  // 🔥 COMBO SYSTEM
  let new_combo = case count > 0 {
    True -> s.combo + count
    False -> s.combo
  }
  
  let new_combo_timer = case count > 0 {
    True -> config.combo_timeout
    False -> s.combo_timer
  }
  
  // 🔥 SCORE AVEC MULTIPLICATEUR
  let multiplier = get_combo_multiplier(new_combo)
  let base_score = count * 20
  let bonus_score = base_score * multiplier
  let new_score = s.score + bonus_score

  // ⚡ Power-ups
  let #(rev_pups, collected_pups) =
    list.fold(s.powerups, #([], []), fn(acc, p) {
      let #(acc_pups, acc_collected) = acc
      let relative_x = p.x -. s.distance
      let dx = f_abs(relative_x -. px)
      let hit = dx <. 100.0 && p.lane == lane

      case hit {
        True -> #(acc_pups, [p, ..acc_collected])
        False -> #([p, ..acc_pups], acc_collected)
      }
    })

  let pups = list.reverse(rev_pups)
  
  // Activer les power-ups collectés
  let new_active_pups = activate_powerups(s.active_powerups, collected_pups)

  let s2 = types.GameState(
    ..s, 
    obstacles: obstacles, 
    diamonds: dias, 
    powerups: pups,
    score: new_score,
    combo: new_combo,
    combo_timer: new_combo_timer,
    active_powerups: new_active_pups,
  )

  case dead {
    True -> types.GameState(..s2, screen: types.GameOver)
    False -> s2
  }
}

// 🔥 Calculer le multiplicateur de combo
fn get_combo_multiplier(combo: Int) -> Int {
  case combo >= config.combo_multiplier_threshold_3 {
    True -> 5
    False ->
      case combo >= config.combo_multiplier_threshold_2 {
        True -> 3
        False ->
          case combo >= config.combo_multiplier_threshold_1 {
            True -> 2
            False -> 1
          }
      }
  }
}

// ⚡ Activer les power-ups collectés
fn activate_powerups(current: types.ActivePowerUps, collected: List(types.PowerUp)) -> types.ActivePowerUps {
  list.fold(collected, current, fn(acc, pup) {
    case pup.type_ {
      types.Invincibility ->
        types.ActivePowerUps(..acc, invincibility_timer: config.invincibility_duration)
      types.Magnet ->
        types.ActivePowerUps(..acc, magnet_timer: config.magnet_duration)
      types.SlowMotion ->
        types.ActivePowerUps(..acc, slowmotion_timer: config.slowmotion_duration)
    }
  })
}

// ─────────────────────────────
// RNG
// ─────────────────────────────

fn random_seed(x: Int) -> Int {
  { x * 1_103_515_245 + 12_345 } % 2_147_483_646
}

fn i_abs(x: Int) -> Int {
  case x < 0 {
    True -> -x
    False -> x
  }
}

fn random_lane(seed: Int) -> #(Int, Int) {
  let s = random_seed(seed)
  let lane = i_abs(s) % config.lanes + 1
  #(lane, s)
}

fn random_obstacle(seed: Int) -> #(Int, types.Spectre, Int) {
  let #(lane, s1) = random_lane(seed)
  let s2 = random_seed(s1)
  #(lane, types.spectre_from_int(i_abs(s2)), s2)
}
