import game/types
import game/config

pub fn draw(_state: types.GameState) -> Nil {
  Nil
}

pub fn get_player_x() -> Float {
  config.world_player_x
}

pub fn lane_to_x(lane: Int, width: Int) -> Int {
  let lane_width = width / config.lanes
  { lane - 1 } * lane_width + lane_width / 2
}
